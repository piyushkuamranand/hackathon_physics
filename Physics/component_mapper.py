import numpy as np
import copy

def beam_splitter_matrix(r):
    """
    Returns the operator matrix for a Beam Splitter.
    r is the reflectivity ratio.
    """
    t = np.sqrt(1 - r)
    return np.array([
        [np.sqrt(r), 1j * t],
        [1j * t, np.sqrt(r)]
    ], dtype=complex)

def phase_shifter_matrix(theta):
    """
    Returns the operator matrix for a Phase Shifter.
    theta is the phase angle.
    """
    return np.array([
        [1, 0],
        [0, np.exp(1j * theta)]
    ], dtype=complex)

def simulate_circuit_matrix(circuit):
    """
    Simulate state evolution based on circuit parameters.
    1. Translate dict components to matrices.
    2. Multiply in sequence.
    3. Determine state amplitudes and detector probabilities.
    
    Returns:
    - final_state: the resulting quantum state vector
    - detector_probabilities: dict with keys like "D1", "D2"
    - annotated_circuit: copy of circuit with deterministic detector probabilities set
    """
    state = np.array([1, 0], dtype=complex)
    annotated_circuit = copy.deepcopy(circuit)
    
    # State evolution via matrix multiplication
    for comp in annotated_circuit:
        comp_type = comp.get("type", "")
        if comp_type in ["BS", "VBS"]:
            r = comp.get("ratio", 0.5)
            mat = beam_splitter_matrix(r)
            state = mat @ state
        elif comp_type == "PS":
            theta = comp.get("phase", 0.0)
            mat = phase_shifter_matrix(theta)
            state = mat @ state
            
    # Compute detector probabilities from finalized state amplitudes
    d1 = float(np.abs(state[0])**2)
    d2 = float(np.abs(state[1])**2)
    probs = {"D1": d1, "D2": d2}
    
    # Annotate passive detector nodes with the state outcome
    prob_index = 0
    for comp in annotated_circuit:
        if comp.get("type") == "D":
            if prob_index == 0:
                comp["probability"] = round(d1, 2)
                prob_index += 1
            else:
                comp["probability"] = round(d2, 2)
                
    return state, probs, annotated_circuit

def get_target_state_vector(target_state_name):
    # Using Bell state amplitude analogue for basic matching test
    if "Bell" in target_state_name:
        return np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=complex)
    elif "GHZ" in target_state_name:
        return np.array([1/np.sqrt(2), -1/np.sqrt(2)], dtype=complex)
    elif "W" in target_state_name:
        return np.array([0, 1], dtype=complex)
    else:
        return np.array([1, 0], dtype=complex)

def evaluate_circuit_physics(circuit, target_state_name="Bell State"):
    """
    Determine fidelity using physically accurate state simulation.
    F = |<target | out>|^2
    """
    state, probs, ann_circ = simulate_circuit_matrix(circuit)
    target = get_target_state_vector(target_state_name)
    fidelity = float(np.abs(np.vdot(target, state))**2)
    return fidelity, probs, ann_circ
