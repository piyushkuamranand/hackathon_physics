def select_parents(population: list, fitness_scores: list, num_parents: int) -> list:
    """
    Top-50% selection: keep the upper half of the population as parents.

    Parameters
    ----------
    population     : list of circuits
    fitness_scores : list of float scores (same order as population)
    num_parents    : ignored — kept for API compatibility; top 50% always returned

    Returns
    -------
    list of circuits (top 50%, sorted descending by score)
    """
    scored = list(zip(population, fitness_scores))
    scored.sort(key=lambda x: x[1], reverse=True)

    # Keep top 50%
    cutoff = max(2, len(scored) // 2)
    parents = [circuit for circuit, score in scored[:cutoff]]
    return parents
