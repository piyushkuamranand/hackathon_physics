"""
selection.py
------------
Parent selection operator for genetic algorithm.

Strategy: Elite selection - keep top-N candidates by fitness.
"""

import copy

def select_parents(population, fitness_scores, num_parents=10):
    if not population or not fitness_scores:
        return []
    scored = list(zip(population, fitness_scores))
    scored.sort(key=lambda x: x[1], reverse=True)
    cutoff = min(num_parents, len(scored))
    if cutoff < 1:
        cutoff = 1
    return [copy.deepcopy(circuit) for circuit, score in scored[:cutoff]]
