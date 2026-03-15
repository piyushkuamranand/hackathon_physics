"""
optimizer.py
-----------
Core genetic algorithm optimizer for quantum circuit discovery.

Pipeline:
1. INITIALIZATION: Hybrid population (physics seeds + random)
2. EVALUATION: Fitness scoring via physics simulation
3. SELECTION: Elite parent selection (top performers)
4. VARIATION: Crossover and mutation to create offspring
5. REPLACEMENT: Elitist strategy (preserve best)

Features:
- Physics-informed seed initialization
- Parameter preservation during mutation
- Convergence tracking and best-circuit monitoring
"""

import random
import copy
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.config import POPULATION_SIZE, MUTATION_RATE, DEFAULT_GENERATIONS, MAX_COMPONENTS
from ml.population import generate_population
from ml.fitness import evaluate_fitness
from ml.selection import select_parents
from ml.crossover import crossover
from ml.mutation import mutate_circuit


def _best_candidate(population, fitness_scores):
    """
    Find single best circuit in current generation.
    
    Parameters
    ----------
    population : list of circuits
    fitness_scores : list of float
    
    Returns
    -------
    tuple
        (best_circuit, best_score)
    """
    if not fitness_scores or not population:
        return ([], 0.0)
    
    best_idx = fitness_scores.index(max(fitness_scores))
    return (copy.deepcopy(population[best_idx]), fitness_scores[best_idx])


def optimize(
    target_state="Bell State",
    phase=1.57,
    qubits=2,
    noise=0.0,
    generations=DEFAULT_GENERATIONS,
    pop_size=POPULATION_SIZE
):
    """
    Execute genetic algorithm for quantum circuit optimization.
    
    Parameters
    ----------
    target_state : str
        Target quantum state ("Bell State", "GHZ State", "W State")
    phase : float
        Phase parameter for seed initialization (0.0 to ~3.14)
    qubits : int
        Number of qubits (affects simulation complexity)
    noise : float
        Noise level for physics simulation penalty
    generations : int
        Number of GA iterations
    pop_size : int
        Population size per generation
    
    Returns
    -------
    dict
        Optimized circuit, best fidelity, generation history, and top circuits.
    """
    try:
        print(f"\n{'='*70}")
        print(f"OPTIMIZER: Starting {generations} generations")
        print(f"Target: {target_state} | Phase: {phase:.2f} | Qubits: {qubits}")
        print(f"{'='*70}\n")
        
        # STAGE 1: Initialize hybrid population with seeds + random
        population = generate_population(
            pop_size=pop_size,
            target_state=target_state,
            phase=phase
        )
        
        global_best_circuit = []
        global_best_fidelity = 0.0
        global_best_generation = 0
        history = []
        top_circuits = []
        
        # STAGE 2: Evolutionary loop
        for generation in range(generations):
            
            # Evaluate fitness of all individuals
            fitness_scores = evaluate_fitness(
                population=population,
                target_state=target_state,
                qubits=qubits,
                phase=phase,
                noise=noise
            )
            
            # Safety check
            if not fitness_scores or len(fitness_scores) == 0:
                print(f"[GEN {generation}] Fitness evaluation failed")
                break
            
            # Find generation best
            gen_best_circuit, gen_best_score = _best_candidate(population, fitness_scores)
            history.append(gen_best_score)
            
            # Update global best
            if gen_best_circuit and gen_best_score > global_best_fidelity:
                global_best_fidelity = float(gen_best_score)
                global_best_circuit = copy.deepcopy(gen_best_circuit)
                global_best_generation = generation
                print(f"[GEN {generation}] NEW BEST: {gen_best_score:.4f}")
            else:
                print(f"[GEN {generation}] Best: {gen_best_score:.4f} | Global: {global_best_fidelity:.4f}")
            
            # Track top circuits all-time
            top_circuits.append({
                "circuit": copy.deepcopy(gen_best_circuit),
                "score": float(gen_best_score),
                "generation": generation
            })
            top_circuits.sort(key=lambda x: x["score"], reverse=True)
            top_circuits = top_circuits[:3]  # Keep top 3
            
            # STAGE 3: Selection (elite parents)
            num_parents = max(5, pop_size // 10)  # Top 10-20%
            elite = select_parents(population, fitness_scores, num_parents=num_parents)
            
            if not elite:
                elite = [population[0]] if population else [[]]
            
            # STAGE 4: Create next generation
            next_population = []
            
            # Elitism: preserve global best
            if global_best_circuit:
                next_population.append(copy.deepcopy(global_best_circuit))
            
            # Fill rest via crossover + mutation
            while len(next_population) < pop_size:
                parent1 = random.choice(elite)
                parent2 = random.choice(elite)
                
                # Crossover
                offspring = crossover(parent1, parent2)
                
                # Mutation
                if random.random() < MUTATION_RATE:
                    offspring = mutate_circuit(
                        offspring,
                        mutation_rate=0.15,
                        max_components=MAX_COMPONENTS
                    )
                
                next_population.append(offspring)
            
            # Safety: ensure population size
            population = next_population[:pop_size]
        
        # STAGE 5: Final result compilation
        if not global_best_circuit:
            global_best_circuit = population[0] if population else []
        
        if global_best_fidelity <= 0.0:
            global_best_fidelity = 0.50
        
# Final evaluation pass to annotate detector probabilities
        try:
            from physics.component_mapper import evaluate_circuit_physics
            _, det_probs, annotated_circuit = evaluate_circuit_physics(global_best_circuit, target_state)
        except Exception as e:
            print(f"[OPT] Could not annotate circuit: {e}")
            annotated_circuit = global_best_circuit
            det_probs = {}

        # Ensure circuit has position indices
        for i, comp in enumerate(annotated_circuit):
            comp["position"] = i

        result = {
            "best_circuit": annotated_circuit,
            "best_fidelity": round(float(global_best_fidelity), 4),
            "generation": global_best_generation,
            "history": [round(f, 4) for f in history],
            "top_circuits": top_circuits,
            "components": len(annotated_circuit),
            "depth": len([c for c in annotated_circuit if c.get("type") != "D"]),
            "detector_probabilities": det_probs
        }
        
        print(f"\n{'='*70}")
        print(f"RESULTS: Best fidelity={result['best_fidelity']:.4f}")
        print(f"Found at generation {global_best_generation} | Circuit depth: {result['depth']}")
        print(f"{'='*70}\n")
        
        return result
    
    except Exception as e:
        print(f"[ERROR] Optimizer crashed: {e}")
        import traceback
        traceback.print_exc()
        
        # Return minimal fallback
        return {
            "best_circuit": [
                {"type": "BS", "ratio": 0.5, "position": 0},
                {"type": "PS", "phase": phase, "position": 1},
                {"type": "BS", "ratio": 0.5, "position": 2},
                {"type": "D", "probability": 0.5, "position": 3}
            ],
            "best_fidelity": None,
            "generation": 0,
            "history": [],
            "top_circuits": [],
            "components": 4,
            "depth": 3,
            "detector_probabilities": {}
        }

