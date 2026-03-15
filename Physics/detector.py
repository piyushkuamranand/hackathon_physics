"""
detector.py
-----------
Simulates single-photon detector measurement probabilities.

For output state [a, b]:
  detector_A   = |a|²
  detector_B   = |b|²
  coincidence  = |a|² * |b|²
"""

import numpy as np


def compute_detector_probabilities(state: np.ndarray) -> dict:
    """
    Compute measurement probabilities from an output quantum state.

    Parameters
    ----------
    state : np.ndarray, shape (2,), complex128

    Returns
    -------
    dict
        {
            "detector_A":  float,   # probability horizontal arm
            "detector_B":  float,   # probability vertical arm
            "coincidence": float    # joint probability
        }
    """
    prob_a = float(np.abs(state[0]) ** 2)
    prob_b = float(np.abs(state[1]) ** 2)
    return {
        "detector_A":  round(prob_a,            6),
        "detector_B":  round(prob_b,            6),
        "coincidence": round(prob_a * prob_b,   6),
    }


if __name__ == "__main__":
    bell = np.array([1 / np.sqrt(2), 1 / np.sqrt(2)], dtype=np.complex128)
    print("Bell state detectors:", compute_detector_probabilities(bell))

    H = np.array([1, 0], dtype=np.complex128)
    print("|H⟩ detectors       :", compute_detector_probabilities(H))
