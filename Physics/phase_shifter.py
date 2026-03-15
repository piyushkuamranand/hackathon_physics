"""
phase_shifter.py
----------------
Phase shifter at 90°.

Matrix:
    P = [[1, 0       ],
         [0, e^(iπ/2)]]
      = [[1, 0],
         [0, i]]
"""

import numpy as np

PHASE_90_MATRIX = np.array(
    [[1, 0],
     [0, np.exp(1j * np.pi / 2)]],   # e^(iπ/2) = i
    dtype=np.complex128
)


def apply_phase_90(state: np.ndarray) -> np.ndarray:
    """Apply a 90° phase shift to the polarization state."""
    return PHASE_90_MATRIX @ state


if __name__ == "__main__":
    s = np.array([1, 1], dtype=np.complex128) / np.sqrt(2)
    print("Input  :", s)
    print("Output :", apply_phase_90(s))
