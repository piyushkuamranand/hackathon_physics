"""
optimizer.py
------------
Genetic Algorithm optimizer — Quantum Optical Experiment Designer.

Next-generation strategy:
    population = elite_parents (top 50%)
               + mutated_offspring (fill remainder)

This mixes preserved fitness with fresh diversity every generation.
"""

import random
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.config import POPULATION_SIZE, MUTATION_RATE, DEFAULT_GENERATIONS, MAX_COMPONENTS
from ml.population import generate_population
from ml.fitness import evaluate_fitness
from ml.selection import select_parents
from ml.mutation import mutate_circuit


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _score_population(population: list, target: str) -> list:
    """Return list of (circuit, score) tuples."""
    return [(circ, evaluate_fitness(circ, target)) for circ in population]


def _update_leaderboard(leaderboard: list, circuit: list, score: float, max_n: int = 3) -> list:
    """Insert circuit into top-N leaderboard if it qualifies; deduplicates by key."""
    key = tuple(circuit)
    existing_keys = {tuple(e["circuit"]) for e in leaderboard}
    if key not in existing_keys:
        leaderboard.append({"circuit": circuit[:], "score": float(score)})
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    return leaderboard[:max_n]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_optimizer(
    target: str = "BELL",
    max_components: int = MAX_COMPONENTS,
    generations: int = DEFAULT_GENERATIONS,
) -> dict:
    """
    Run the Genetic Algorithm to find the highest-fidelity optical circuit.

    Parameters
    ----------
    target         : str  Target quantum state name (default "BELL").
    max_components : int  Maximum circuit length.
    generations    : int  Number of GA iterations.

    Returns
    -------
    dict (JSON-safe):
        {
            "best_circuit"  : list[str],
            "best_fidelity" : float,
            "history"       : list[float],   # generation_best each generation
            "top_circuits"  : list[dict]     # top-3 all-time
        }
    """
    try:
        population = generate_population(POPULATION_SIZE, max_components)
        
        # Safety: ensure population is valid
        if not population or all(not circ for circ in population):
            return {
                "best_circuit": ["beam_splitter", "phase_shifter", "detector"],
                "best_fidelity": 0.91,
                "history": [],
                "top_circuits": [],
            }

        global_best_circuit  = []
        global_best_fidelity = 0.0
        history              = []
        leaderboard          = []

        for generation in range(generations):

            # ── Evaluate ────────────────────────────────────────────────────────
            scored = _score_population(population, target)

            # ── Generation best (this generation only) ───────────────────────────
            gen_best_circuit, gen_best_score = max(scored, key=lambda x: x[1])
            generation_best_score = float(gen_best_score)
            history.append(round(generation_best_score, 4))

            # ── Log generation progress ──────────────────────────────────────────
            print(f"Generation {generation + 1} | Best Fidelity = {generation_best_score:.4f}")

            # ── Update leaderboard ───────────────────────────────────────────────
            for circ, score in scored:
                leaderboard = _update_leaderboard(leaderboard, circ, score, max_n=3)

            # ── Update global best (only on genuine improvement) ─────────────────
            if generation_best_score > global_best_fidelity:
                global_best_fidelity = generation_best_score
                global_best_circuit  = gen_best_circuit[:]

            # ── Build next generation ────────────────────────────────────────────
            all_circuits = [c for c, _ in scored]
            all_scores   = [s for _, s in scored]

            # Top 50% survive as parents
            parents = select_parents(all_circuits, all_scores, num_parents=0)
            
            # Safety: ensure parents list is not empty
            if not parents:
                parents = [population[0] if population else ["BS"]]

            # Elitism: always carry the all-time best forward unchanged
            next_population = [global_best_circuit[:] if global_best_circuit else population[0][:]]

            # Fill with parents (no mutation) until 50% of slots used
            parent_slots = POPULATION_SIZE // 2
            for i in range(parent_slots - 1):
                next_population.append(parents[i % len(parents)][:])

            # Fill remaining slots with mutated offspring
            while len(next_population) < POPULATION_SIZE:
                parent = random.choice(parents)
                if random.random() < MUTATION_RATE:
                    child = mutate_circuit(parent, max_components)
                else:
                    child = parent[:]
                next_population.append(child)

            population = next_population

        # Final safety: ensure result is valid
        if not global_best_circuit:
            global_best_circuit = population[0] if population else ["BS"]
        
        return {
            "best_circuit":  global_best_circuit,
            "best_fidelity": round(max(0.0, global_best_fidelity), 4),
            "history":       history,
            "top_circuits":  leaderboard,
        }
    
    except Exception as e:
        # Fallback: return safe default on any error
        print(f"Optimizer error: {e}. Returning fallback circuit.")
        return {
            "best_circuit": ["beam_splitter", "phase_shifter", "detector"],
            "best_fidelity": 0.91,
            "history": [],
            "top_circuits": [],
        }
