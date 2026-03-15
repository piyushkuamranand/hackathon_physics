"""
physics_engine.py
-----------------
Single integration entry point for the Quantum Optical physics simulation.

Exposes:
    get_target_state(name)
    evolve_state(circuit, initial_state=None)
    fidelity(target_state, output_state)
    simulate_circuit(circuit, target_name="BELL")

ML compatibility:
    from physics.physics_engine import evolve_state, fidelity, get_target_state
"""

import sys
import os

# Ensure project root is on sys.path so 'physics.*' resolves from anywhere
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import numpy as np
from typing import List, Optional

from physics.beam_splitter  import apply_beam_splitter
from physics.waveplates     import apply_hwp_45, apply_qwp_45
from physics.phase_shifter  import apply_phase_90
from physics.target_states  import get_target_state
from physics.fidelity       import compute_fidelity
from physics.detector       import compute_detector_probabilities

# Default initial state: horizontal polarisation |H⟩
_INITIAL_STATE = np.array([1.0, 0.0], dtype=np.complex128)

# Dispatcher: component name → transform function
_COMPONENT_MAP = {
    "BS":       apply_beam_splitter,
    "HWP(45)":  apply_hwp_45,
    "QWP(45)":  apply_qwp_45,
    "PHASE(90)": apply_phase_90,
    "ID":       lambda s: s.copy(),   # identity - no-op
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def evolve_state(
    circuit: List[str],
    initial_state: Optional[np.ndarray] = None,
) -> np.ndarray:
    """
    Sequentially apply optical components to a quantum state.

    Parameters
    ----------
    circuit       : List[str]  e.g. ["BS", "HWP(45)", "PHASE(90)"]
    initial_state : np.ndarray (optional)  Defaults to |H⟩ = [1, 0].

    Returns
    -------
    np.ndarray, shape (2,), complex128 — normalised output state.
    """
    state = (_INITIAL_STATE.copy() if initial_state is None
             else initial_state.copy())

    for component in circuit:
        transform = _COMPONENT_MAP.get(component)
        if transform is None:
            raise ValueError(
                f"Unknown component '{component}'. "
                f"Supported: {list(_COMPONENT_MAP.keys())}"
            )
        state = transform(state)

    # Normalise
    norm = np.linalg.norm(state)
    if norm > 1e-12:
        state = state / norm

    return state


def fidelity(target_state: np.ndarray, output_state: np.ndarray) -> float:
    """
    Wrapper around compute_fidelity for ML compatibility.

    Returns
    -------
    float  Fidelity in [0, 1].
    """
    return compute_fidelity(target_state, output_state)


def simulate_circuit(
    circuit: List[str],
    target_name: str = "BELL",
) -> dict:
    """
    Full end-to-end simulation: evolve circuit → compute fidelity + detectors.

    Parameters
    ----------
    circuit     : List[str]  Optical component sequence.
    target_name : str        Name of target quantum state (default "BELL").

    Returns
    -------
    dict (JSON-safe):
        {
            "state"    : [float, float],          # output state as real list
            "fidelity" : float,
            "detectors": {"detector_A", "detector_B", "coincidence"},
            "log"      : List[str]
        }
    """
    log: List[str] = []

    # 1. Initial state
    state = _INITIAL_STATE.copy()
    log.append("Initial state: |H⟩ = [1, 0]")

    # 2. Target state
    target = get_target_state(target_name)
    log.append(f"Target state  : {target_name} = {target.tolist()}")

    # 3. Evolve
    for component in circuit:
        transform = _COMPONENT_MAP.get(component)
        if transform is None:
            raise ValueError(f"Unknown component '{component}'.")
        state = transform(state)
        log.append(f"Applied {component}")

    # 4. Normalise
    norm = np.linalg.norm(state)
    if norm > 1e-12:
        state = state / norm
    log.append(f"Normalised state: {state.tolist()}")

    # 5. Fidelity + detectors
    fid = compute_fidelity(target, state)
    detectors = compute_detector_probabilities(state)
    log.append(f"Fidelity vs {target_name}: {fid:.6f}")

    return {
        "state":     [float(np.real(state[0])), float(np.real(state[1]))],
        "fidelity":  float(fid),
        "detectors": detectors,
        "log":       log,
    }


# ---------------------------------------------------------------------------
# Manual test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    test_circuit = ["BS", "HWP(45)", "PHASE(90)"]
    print(f"Circuit : {test_circuit}\n")
    result = simulate_circuit(test_circuit, target_name="BELL")

    print("State    :", result["state"])
    print("Fidelity :", result["fidelity"])
    print("Detectors:", result["detectors"])
    print("\nLog:")
    for entry in result["log"]:
        print(" ", entry)
