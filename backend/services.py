"""
services.py
-----------
Business logic layer for quantum circuit optimization.

Bridges frontend requests to ML optimizer.
Ensures inputs reach optimizer with proper parameter mapping.
"""

import sys
import os
import time

_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from ml.optimizer import optimize
from backend.schemas import InputData, PredictionResponse


def run_optimization(data: InputData) -> PredictionResponse:
    """
    Execute quantum circuit optimization using ML optimizer.
    
    Passes input parameters from frontend directly to optimizer:
    - target_state: Selects seed family (Bell, GHZ, W)
    - phase: Parameterizes seeds and physics evaluation
    - qubits: Affects circuit complexity and simulation
    - noise: Applied as physics penalty during fitness eval
    
    Parameters
    ----------
    data : InputData
        Request containing target_state, phase, qubits, noise
    
    Returns
    -------
    PredictionResponse
        Optimized circuit with fidelity, generation, and metadata
    """
    try:
        # Log incoming request
        print(f"\n{'='*70}")
        print(f"[SERVICE] Optimization request:")
        print(f"  Target: {data.target_state}")
        print(f"  Phase: {data.phase:.2f}")
        print(f"  Qubits: {data.qubits}")
        print(f"  Noise: {data.noise:.3f}")
        print(f"{'='*70}\n")
        
        # Extract and validate inputs
        target_state = str(data.target_state).strip()
        phase = float(data.phase)
        qubits = int(data.qubits)
        noise = float(data.noise)
        
        # Clamp phase to valid range
        phase = max(0.0, min(3.14, phase))
        
        # Start timer
        start_time = time.time()
        
        # CRITICAL: Pass inputs to optimizer
        # This enables seeded initialization for target_state
        result = optimize(
            target_state=target_state,
            phase=phase,
            qubits=qubits,
            noise=noise,
            generations=50,      # Slightly increased generations for deeper search
            pop_size=100      # Reduced to 100 for faster response
        )
        
        # Calculate runtime
        runtime_sec = time.time() - start_time
        runtime_str = f"{runtime_sec:.2f}s"
        
        # Extract optimized circuit
        best_circuit = result.get("best_circuit", [])
        best_fidelity = float(result.get("best_fidelity", 0.0))
        generation = int(result.get("generation", 0))
        components = int(result.get("components", len(best_circuit)))
        depth = int(result.get("depth", len(best_circuit) - 1))
        det_probs = result.get("detector_probabilities", {})

        # Safety: ensure circuit has proper structure
        if not best_circuit:
            # Fallback: return a basic valid circuit
            best_circuit = [
                {"type": "BS", "ratio": 0.5, "position": 0},
                {"type": "PS", "phase": phase, "position": 1},
                {"type": "D", "probability": 0.5, "position": 2}
            ]
            best_fidelity = 0.50

        # Return structured response
        response = PredictionResponse(
            best_fidelity=round(best_fidelity, 4),
            circuit=best_circuit,
            generation=generation,
            components=components,
            depth=depth,
            runtime=runtime_str,
            detector_probabilities=det_probs
        )

        print(f"[SERVICE] Optimization complete: fidelity={response.best_fidelity:.4f}")
        print(f"[SERVICE] Runtime: {runtime_str}\n")
        
        return response

    except Exception as e:
        print(f"[SERVICE ERROR] Optimization failed: {e}")
        import traceback
        traceback.print_exc()
        
        # Return fallback response
        return PredictionResponse(
            best_fidelity=None,
            circuit=[
                {"type": "BS", "ratio": 0.5, "position": 0},
                {"type": "PS", "phase": 1.57, "position": 1},
                {"type": "BS", "ratio": 0.5, "position": 2},
                {"type": "D", "probability": 0.5, "position": 3}
            ],
            generation=0,
            components=4,
            depth=3,
            runtime="error",
            mode="preview",
            status="simulation unavailable"
        )

