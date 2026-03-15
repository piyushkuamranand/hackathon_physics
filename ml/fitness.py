"""
fitness.py
----------
Fitness evaluation using physics-based fidelity scoring with real matrix pipeline.

Fitness formula:
    fitness = fidelity - complexity_penalty
"""

import sys
import os

_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from Physics.component_mapper import evaluate_circuit_physics

def evaluate_circuit_fidelity(circuit, target_state="Bell State", qubits=2, phase=1.57, noise=0.0):
    """Evaluate fidelity of a single circuit using new physics engine."""
    if not circuit:
        return 0.0

    try:
        fidelity, _, _ = evaluate_circuit_physics(circuit, target_state)
        # Apply noise gently
        fidelity = max(0.0, min(1.0, float(fidelity) * (1 - noise/10)))
        return fidelity
    except Exception as e:
        print(f"[FITNESS] Fidelity evaluation error: {e}")
        return 0.0

def evaluate_fitness(population, target_state="Bell State", qubits=2, phase=1.57, noise=0.0):
    """Evaluate fitness scores for all circuits in population."""
    fitness_scores = []
    for circuit in population:
        if not circuit or not isinstance(circuit, list):
            fitness_scores.append(0.0)
            continue
        try:
            fidelity = evaluate_circuit_fidelity(
                circuit,
                target_state=target_state,
                qubits=qubits,
                phase=phase,
                noise=noise
            )
            # Apply complexity penalty (e.g. no penalty if <= 6, slightly punish long circuits)
            penalty = 0.02 * max(0, len(circuit) - 6)
            fitness = fidelity - penalty
            fitness = max(0.0, min(1.0, fitness))
            fitness_scores.append(float(fitness))
        except Exception as e:
            print(f"[FITNESS] Error evaluating circuit: {e}")
            fitness_scores.append(0.0)
    return fitness_scores
