"""
beam_splitter.py
----------------
50/50 Beam Splitter transformation.

Matrix:
    B = (1/√2) * [[1, i],
                   [i, 1]]
"""

import numpy as np

# Beam splitter unitary (50/50)
BS_MATRIX = (1 / np.sqrt(2)) * np.array(
    [[1, 1j],
     [1j, 1]],
    dtype=np.complex128
)


def apply_beam_splitter(state: np.ndarray) -> np.ndarray:
    """
    Apply 50/50 beam splitter to a 2-component polarization state.

    Parameters
    ----------
    state : np.ndarray, shape (2,), dtype complex128

    Returns
    -------
    np.ndarray
        Transformed state.
    """
    return BS_MATRIX @ state


if __name__ == "__main__":
    s = np.array([1, 0], dtype=np.complex128)
    print("Input  :", s)
    print("Output :", apply_beam_splitter(s))
