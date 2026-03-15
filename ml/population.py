"""
population.py
--------------
Population initialization with physics-informed seed circuits.

Features:
- Hybrid population: physics seeds + random diversity
- Parameterized seeds based on target quantum state
- Seeds occupy 10-20% of population, rest random
- Full parameter preservation in components
"""

import random
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.seed_library import get_seed_population


def generate_id():
    """Generate unique component ID."""
    return f"c_{random.randint(1000, 9999)}"


def generate_random_component():
    """
    Generate a random quantum optical component with parameters.
    
    Returns
    -------
    dict
        Component with type and appropriate parameters.
    """
    comp_type = random.choice(["BS", "PS", "D"])
    comp = {"type": comp_type, "id": generate_id()}
    
    if comp_type == "PS":
        comp["phase"] = round(random.uniform(0.0, 3.14), 2)
    elif comp_type == "BS":
        comp["ratio"] = round(random.uniform(0.3, 0.7), 2)
    elif comp_type == "D":
        comp["probability"] = round(random.uniform(0.4, 0.6), 2)
    
    return comp


def generate_random_individual(min_length=3, max_length=6):
    """
    Generate a random circuit chromosome.
    
    Parameters
    ----------
    min_length : int
        Minimum components in circuit.
    max_length : int
        Maximum components in circuit.
    
    Returns
    -------
    list of dict
        Random circuit with component-level parameters.
    """
    length = random.randint(min_length, max_length)
    circuit = []
    
    for i in range(length):
        comp = generate_random_component()
        comp["position"] = i
        circuit.append(comp)
    
    return circuit


def generate_population(pop_size=50, target_state=None, phase=None):
    """
    Generate hybrid population: seeded + random.
    
    Seeds occupy 10-20% of population. Rest are random.
    
    Parameters
    ----------
    pop_size : int
        Total population size (default 50).
    target_state : str, optional
        Target quantum state: "Bell State", "GHZ State", "W State".
        If None, pure random population.
    phase : float, optional
        Phase parameter for seed initialization (0.0 to ~3.14).
        If None, defaults to 1.57 (pi/2).
    
    Returns
    -------
    list of list of dict
        Population of circuits with physical parameters.
    """
    if phase is None:
        phase = 1.57  # Default to pi/2
    
    population = []
    
    # STAGE 1: Add seeds if target state provided
    if target_state:
        seeds = get_seed_population(target_state, phase)
        population.extend(seeds)
        print(f"[SEED DEBUG] Added {len(seeds)} seed(s) for {target_state}")
    
    # STAGE 2: Fill rest with random diversity
    while len(population) < pop_size:
        random_circuit = generate_random_individual()
        population.append(random_circuit)
    
    # Debug: show first generation composition
    num_seeds = len(population) - max(0, pop_size - len(seeds) if target_state else 0)
    print(f"[POPULATION] Generated {len(population)} individuals: "
          f"{num_seeds} seeded, {len(population) - num_seeds} random")
    
    return population
