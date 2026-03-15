"""
waveplates.py
-------------
Half-Wave Plate (HWP) and Quarter-Wave Plate (QWP) at 45°.

HWP(45°):
    [[0, 1],
     [1, 0]]

QWP(45°):
    [[1, 0],
     [0, i]]
"""

import numpy as np

HWP_45_MATRIX = np.array(
    [[0, 1],
     [1, 0]],
    dtype=np.complex128
)

QWP_45_MATRIX = np.array(
    [[1, 0],
     [0, 1j]],
    dtype=np.complex128
)


def apply_hwp_45(state: np.ndarray) -> np.ndarray:
    """Apply Half-Wave Plate at 45° to the polarization state."""
    return HWP_45_MATRIX @ state


def apply_qwp_45(state: np.ndarray) -> np.ndarray:
    """Apply Quarter-Wave Plate at 45° to the polarization state."""
    return QWP_45_MATRIX @ state


if __name__ == "__main__":
    s = np.array([1, 0], dtype=np.complex128)
    print("Input      :", s)
    print("HWP(45) out:", apply_hwp_45(s))
    print("QWP(45) out:", apply_qwp_45(s))
