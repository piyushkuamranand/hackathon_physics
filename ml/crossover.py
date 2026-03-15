"""
crossover.py
------------
Single-point crossover operator for optical circuits.

Two parent circuits swap their tails at a randomly chosen cut-point,
producing one child circuit. The child is validated and clamped to
[MIN_CIRCUIT_LENGTH, MAX_CIRCUIT_LENGTH] using allowed components only.

Example:
    Parent1 = ["BS",  "HWP"]
    Parent2 = ["QWP", "PHASE"]
    ─── cut at index 1 ───
    Child   = ["BS",  "PHASE"]          (head of P1 + tail of P2)
"""

import random
import sys
import os
from typing import List, Dict, Any

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.config import (
    ALLOWED_COMPONENTS,
    MIN_CIRCUIT_LENGTH,
    MAX_CIRCUIT_LENGTH,
    KEY_CIRCUIT,
    POPULATION_SIZE,
)

Circuit = List[str]
ScoredCircuit = Dict[str, Any]


# ---------------------------------------------------------------------------
# Core crossover operation
# ---------------------------------------------------------------------------

def crossover(parent1: Circuit, parent2: Circuit) -> Circuit:
    """
    Perform single-point crossover between two parent circuits.

    The cut-point is chosen uniformly from [1, min(len(p1), len(p2)) - 1]
    so that each parent contributes at least one component.

    The resulting child is clamped to [MIN_CIRCUIT_LENGTH, MAX_CIRCUIT_LENGTH]:
    - If too short: pad with random allowed components.
    - If too long : truncate.

    Parameters
    ----------
    parent1, parent2 : Circuit

    Returns
    -------
    Circuit
        A valid offspring circuit.
    """
    # Safety: handle empty parents
    if not parent1 and not parent2:
        return [random.choice(ALLOWED_COMPONENTS)]
    if not parent1:
        parent1 = [random.choice(ALLOWED_COMPONENTS)]
    if not parent2:
        parent2 = [random.choice(ALLOWED_COMPONENTS)]
    
    # Determine safe cut range
    max_cut = min(len(parent1), len(parent2)) - 1
    # Ensure cut is in valid range [1, max_cut] or [1, 1] if max_cut < 1
    cut = random.randint(1, max(1, max_cut)) if max_cut >= 1 else 1

    # Head from parent1, tail from parent2
    child = parent1[:cut] + parent2[cut:]

    # Enforce length constraints
    if len(child) < MIN_CIRCUIT_LENGTH:
        while len(child) < MIN_CIRCUIT_LENGTH:
            child.append(random.choice(ALLOWED_COMPONENTS))
    elif len(child) > MAX_CIRCUIT_LENGTH:
        child = child[:MAX_CIRCUIT_LENGTH]

    return child


# ---------------------------------------------------------------------------
# Population-level crossover
# ---------------------------------------------------------------------------

def crossover_population(
    best_population: List[ScoredCircuit],
    target_size: int = POPULATION_SIZE,
) -> List[Circuit]:
    """
    Generate *target_size* offspring by randomly pairing elite parents.

    Parameters
    ----------
    best_population : List[ScoredCircuit]
        Output of selection.select_best().
    target_size : int
        How many offspring to produce.

    Returns
    -------
    List[Circuit]
        New circuits produced by crossover only (not yet mutated).
    """
    if not best_population:
        # Fallback: generate random valid circuits
        return [[random.choice(ALLOWED_COMPONENTS) for _ in range(2)] for _ in range(target_size)]

    elites: List[Circuit] = [rec[KEY_CIRCUIT] for rec in best_population if rec.get(KEY_CIRCUIT)]
    
    # Safety: if no valid elites, use fallback
    if not elites:
        elites = [[random.choice(ALLOWED_COMPONENTS) for _ in range(2)]]
    
    offspring: List[Circuit] = []

    while len(offspring) < target_size:
        if len(elites) >= 2:
            p1, p2 = random.sample(elites, 2)
        else:
            p1 = p2 = elites[0]          # degenerate case: single elite
        offspring.append(crossover(p1, p2))

    return offspring[:target_size]


# ---------------------------------------------------------------------------
# Quick self-test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    p1 = ["BS", "HWP"]
    p2 = ["QWP", "PHASE"]
    print(f"Parent1 : {p1}")
    print(f"Parent2 : {p2}")
    print("\n5 crossover children:")
    for i in range(5):
        child = crossover(p1, p2)
        print(f"  Child {i+1}: {child}")

    # Population-level demo
    dummy_elite = [
        {"circuit": ["BS", "HWP"],         "score": 0.90},
        {"circuit": ["QWP", "PHASE"],       "score": 0.85},
        {"circuit": ["BS", "QWP", "PHASE"], "score": 0.88},
    ]
    new_gen = crossover_population(dummy_elite, target_size=6)
    print(f"\ncrossover_population (6 offspring):")
    for c in new_gen:
        print(f"  {c}")
