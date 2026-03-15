"""
fidelity.py
-----------
Quantum state overlap fidelity.

Formula:
    F = |⟨ψ_target | ψ_out⟩|²
"""

import numpy as np


def compute_fidelity(target_state: np.ndarray, output_state: np.ndarray) -> float:
    """
    Compute fidelity between two normalised quantum state vectors.

    Parameters
    ----------
    target_state  : np.ndarray, shape (2,), complex128
    output_state  : np.ndarray, shape (2,), complex128

    Returns
    -------
    float
        Fidelity in [0, 1].
    """
    overlap = np.dot(np.conj(target_state), output_state)
    return float(np.abs(overlap) ** 2)


if __name__ == "__main__":
    H = np.array([1, 0], dtype=np.complex128)
    bell = np.array([1 / np.sqrt(2), 1 / np.sqrt(2)], dtype=np.complex128)
    print("F(H, bell)  :", compute_fidelity(H, bell))
    print("F(bell,bell):", compute_fidelity(bell, bell))
