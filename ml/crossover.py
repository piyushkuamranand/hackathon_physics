"""
crossover.py
-----------
Single-point crossover operator for quantum circuits.

Two parent circuits swap their tails at a randomly chosen cut-point,
preserving all component parameters (phase, ratio, probability).
"""

import random
import copy


def crossover(parent1, parent2):
    """
    Perform single-point crossover between two parent circuits.
    """
    # Safety: handle empty parents
    if not parent1 or not parent2:
        return copy.deepcopy(parent1) if parent1 else copy.deepcopy(parent2)    

    if len(parent1) <= 1 or len(parent2) <= 1:
        # Too small to cross - return copy of random parent
        return copy.deepcopy(random.choice([parent1, parent2]))

    # Choose cut points
    cut1 = random.randint(1, len(parent1) - 1)
    cut2 = random.randint(1, len(parent2) - 1)

    # Single-point crossover: head from parent1 + tail from parent2
    offspring = copy.deepcopy(parent1[:cut1]) + copy.deepcopy(parent2[cut2:])   

    # Re-assign positions
    for i, comp in enumerate(offspring):
        comp["position"] = i

    return offspring
