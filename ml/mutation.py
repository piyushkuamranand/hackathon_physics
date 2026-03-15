"""
mutation.py
-----------
Genetic mutation operators preserving physical component parameters.
"""

import random
import sys
import os

def generate_id():
    return f"c_{random.randint(1000, 9999)}"

def mutate_component_parameter(component):
    comp = component.copy()
    comp_type = comp.get("type")
    
    # Phase shifter: mutate phase
    if comp_type == "PS" and "phase" in comp:
        comp["phase"] = max(0.0, min(3.14, comp["phase"] + random.uniform(-0.2, 0.2)))
        comp["phase"] = round(comp["phase"], 2)
        
    # Beam splitters: mutate ratio
    elif comp_type in ["BS", "VBS"] and "ratio" in comp:
        comp["ratio"] = max(0.1, min(0.9, comp["ratio"] + random.uniform(-0.1, 0.1)))
        comp["ratio"] = round(comp["ratio"], 2)
        
    # Detector probability is passively calculated, do not mutate it.
    elif comp_type == "D":
        pass

    return comp


def create_random_component():
    comp_type = random.choice(["BS", "PS", "D"])
    comp = {"type": comp_type, "id": generate_id()}

    if comp_type == "PS":
        comp["phase"] = round(random.uniform(0.0, 3.14), 2)
    elif comp_type == "BS":
        comp["ratio"] = round(random.uniform(0.3, 0.7), 2)
    elif comp_type == "D":
        # Probability computed computationally later, fallback 0.5
        comp["probability"] = 0.5

    return comp


def mutate_circuit(circuit, mutation_rate=0.15, max_components=6):
    if not circuit or not isinstance(circuit, list):
        return [create_random_component()]

    mutated = []

    # STAGE 1: Parameter mutation on existing components
    for comp in circuit:
        if random.random() < mutation_rate:
            mutated.append(mutate_component_parameter(comp))
        else:
            mutated.append(comp.copy())

    # STAGE 2: Structural mutation
    struct_prob = mutation_rate / 2

    if random.random() < struct_prob:
        if len(mutated) < max_components:
            new_comp = create_random_component()
            insert_pos = random.randint(0, len(mutated))
            mutated.insert(insert_pos, new_comp)
        elif len(mutated) > 2:
            delete_pos = random.randint(0, len(mutated) - 1)
            mutated.pop(delete_pos)

    # STAGE 3: Re-assign positions
    for i, comp in enumerate(mutated):
        comp["position"] = i

    return mutated
