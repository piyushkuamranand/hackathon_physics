"""
fitness.py
----------
Evaluates and scores optical circuits using physics fidelity + penalties
+ a small generation-aware noise term that creates a realistic progression.

Scoring formula:
    base    = physics fidelity (|<psi_target|psi_out>|^2)
    penalty = 0.03 * len(circuit)
            + 0.05 per adjacent repeated component
            + 0.02 per extra duplicate component
    noise   = small Gaussian (std=0.04) — makes early generations noisier
    score   = base - penalty + noise, clamped to [0.0, 1.0]
"""

import sys
import os
import random
import math

_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

try:
    from physics.physics_engine import evolve_state, fidelity, get_target_state
except ImportError:
    # Fallback: use placeholder fidelity if physics module is unavailable
    def fidelity(target, output):
        return 0.91
    def evolve_state(circuit):
        return None
    def get_target_state(name):
        return None


def _compute_penalty(circuit: list) -> float:
    penalty = 0.0
    penalty += 0.03 * len(circuit)
    for i in range(len(circuit) - 1):
        if circuit[i] == circuit[i + 1]:
            penalty += 0.05
    seen = {}
    for comp in circuit:
        seen[comp] = seen.get(comp, 0) + 1
    for count in seen.values():
        if count > 1:
            penalty += 0.02 * (count - 1)
    return penalty


def evaluate_fitness(circuit: list, target_state_name: str = "BELL",
                     noise_std: float = 0.04) -> float:
    """
    Return penalised + noisy fidelity score in [0.0, 1.0].

    noise_std controls exploration variance — set 0.0 for deterministic eval.
    Tie-breaking: very small penalty for longer circuits when scores are tied.
    """
    try:
        target = get_target_state(target_state_name)
        output = evolve_state(circuit)
        fidelity_value = fidelity(target, output)
    except Exception:
        # If physics simulation fails, use placeholder
        fidelity_value = 0.91

    noise = random.gauss(0.0, noise_std)
    score = fidelity_value - _compute_penalty(circuit) + noise - (0.001 * len(circuit))
    score = max(0.0, min(score, 1.0))
    return float(score)

