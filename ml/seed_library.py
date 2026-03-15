"""
seed_library.py
---------------
Physics-informed pretrained seed circuits for quantum optical experiments.

This module provides optimized seed circuits for common quantum states:
- Bell States (2 qubits)
- GHZ States (3+ qubits)
- W States (3+ qubits)

Seeds are parameterized with input phase and include component parameters
(ratio for beam splitters, phase for phase shifters, probability for detectors).

Each seed is a list of component dictionaries with type and parameters.
"""

import random


def bell_seed_1(phase):
    """
    Bell state seed 1: BS → PS → BS → D
    Classical 50:50 balanced configuration with phase modulation.
    
    Parameters
    ----------
    phase : float
        Phase parameter (0.0 to ~3.14) for the phase shifter component.
    
    Returns
    -------
    list of dict
        Circuit components with type and parameters.
    """
    return [
        {"type": "BS", "ratio": 0.5, "position": 0},
        {"type": "PS", "phase": phase, "position": 1},
        {"type": "BS", "ratio": 0.5, "position": 2},
        {"type": "D", "probability": 0.5, "position": 3}
    ]


def bell_seed_2(phase):
    """
    Bell state seed 2: BS → VBS → PS → D
    Variant using variable beam splitter with asymmetric ratio.
    
    Parameters
    ----------
    phase : float
        Phase parameter for the phase shifter.
    
    Returns
    -------
    list of dict
        Circuit components with type and parameters.
    """
    return [
        {"type": "BS", "ratio": 0.5, "position": 0},
        {"type": "VBS", "ratio": 0.65, "position": 1},
        {"type": "PS", "phase": phase, "position": 2},
        {"type": "D", "probability": 0.48, "position": 3}
    ]


def ghz_seed_1(phase):
    """
    GHZ state seed 1: BS → PS → BS → BS → D
    Extended configuration for 3+ qubit entanglement.
    
    Parameters
    ----------
    phase : float
        Phase parameter for the phase shifter.
    
    Returns
    -------
    list of dict
        Circuit components with type and parameters.
    """
    return [
        {"type": "BS", "ratio": 0.5, "position": 0},
        {"type": "PS", "phase": phase, "position": 1},
        {"type": "BS", "ratio": 0.5, "position": 2},
        {"type": "BS", "ratio": 0.5, "position": 3},
        {"type": "D", "probability": 0.5, "position": 4}
    ]


def w_seed_1(phase):
    """
    W state seed 1: BS → PS → BS → D
    Asymmetric configuration optimized for W state generation.
    
    Parameters
    ----------
    phase : float
        Phase parameter for the phase shifter.
    
    Returns
    -------
    list of dict
        Circuit components with type and parameters.
    """
    return [
        {"type": "BS", "ratio": 0.33, "position": 0},
        {"type": "PS", "phase": phase, "position": 1},
        {"type": "BS", "ratio": 0.66, "position": 2},
        {"type": "D", "probability": 0.45, "position": 3}
    ]


def get_seed_population(target_state, phase):
    """
    Select seed family based on target quantum state.
    
    Parameters
    ----------
    target_state : str
        One of: "Bell State", "GHZ State", "W State", "BELL", "GHZ", "W"
    phase : float
        Phase parameter to parameterize all seeds.
    
    Returns
    -------
    list of list of dict
        Seed circuits for the target state. Empty if state not recognized.
    """
    # Normalize state name
    state_lower = target_state.lower().replace(" state", "")
    
    if state_lower == "bell":
        return [bell_seed_1(phase), bell_seed_2(phase)]
    elif state_lower == "ghz":
        return [ghz_seed_1(phase)]
    elif state_lower == "w":
        return [w_seed_1(phase)]
    else:
        # Unknown state - return empty to trigger pure random
        return []


def format_component_for_display(component):
    """
    Format a component dictionary for frontend display.
    
    Parameters
    ----------
    component : dict
        Component with type and parameters.
    
    Returns
    -------
    str
        Human-readable component representation.
    """
    comp_type = component.get("type", "?")
    
    if comp_type == "BS":
        ratio = component.get("ratio", 0.5)
        return f"{int(ratio*100)}:{int((1-ratio)*100)} BS"
    elif comp_type == "VBS":
        ratio = component.get("ratio", 0.5)
        return f"VBS({ratio:.2f})"
    elif comp_type == "PS":
        phase = component.get("phase", 0.0)
        return f"PS(θ={phase:.2f})"
    elif comp_type == "D":
        prob = component.get("probability", 0.5)
        return f"D({int(prob*100)}%)"
    else:
        return comp_type
