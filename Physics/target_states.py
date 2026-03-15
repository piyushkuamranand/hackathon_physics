"""
target_states.py
----------------
Known quantum target states for fidelity comparison.

Supported:
  "BELL"   →  |Φ+⟩ = (1/√2)(|H⟩ + |V⟩)  =  [1/√2, 1/√2]
  "H"      →  horizontal  |H⟩              =  [1, 0]
  "V"      →  vertical    |V⟩              =  [0, 1]
  "PLUS"   →  diagonal    |+⟩              =  [1/√2, 1/√2]
  "MINUS"  →  anti-diag   |−⟩              =  [1/√2, -1/√2]
"""

import numpy as np

_STATES = {
    "BELL":  np.array([1 / np.sqrt(2),  1 / np.sqrt(2)], dtype=np.complex128),
    "H":     np.array([1.0,             0.0            ], dtype=np.complex128),
    "V":     np.array([0.0,             1.0            ], dtype=np.complex128),
    "PLUS":  np.array([1 / np.sqrt(2),  1 / np.sqrt(2)], dtype=np.complex128),
    "MINUS": np.array([1 / np.sqrt(2), -1 / np.sqrt(2)], dtype=np.complex128),
}


def get_target_state(name: str) -> np.ndarray:
    """
    Return the target quantum state vector for a named state.

    Parameters
    ----------
    name : str  One of "BELL", "H", "V", "PLUS", "MINUS".

    Returns
    -------
    np.ndarray, shape (2,), dtype complex128
    """
    key = name.upper()
    if key not in _STATES:
        raise ValueError(
            f"Unknown target state '{name}'. "
            f"Supported: {list(_STATES.keys())}"
        )
    return _STATES[key].copy()


if __name__ == "__main__":
    for name in _STATES:
        s = get_target_state(name)
        print(f"{name:6s}  →  {s}")
