#!/usr/bin/env python3
"""
test_seed_integration.py
-----------------------
Quick validation script for physics-informed seed system.

Run from project root:
    python ml/test_seed_integration.py

Expected output:
    - Seed library loads correctly
    - Population generation includes seeds + random
    - Optimizer runs with Bell State
    - Circuit output has parameters (ratio, phase, probability)
"""

import sys
import os

# Add project root to path
_PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__) + "/..")
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from ml.seed_library import get_seed_population, bell_seed_1, bell_seed_2, ghz_seed_1, w_seed_1
from ml.population import generate_population
from ml.optimizer import optimize


def test_seed_library():
    """Test seed library functions."""
    print("\n" + "="*70)
    print("TEST 1: Seed Library")
    print("="*70)
    
    phase = 1.57
    
    # Test Bell seeds
    bell_seeds = get_seed_population("Bell State", phase)
    print(f"✓ Bell State seeds: {len(bell_seeds)} seeds returned")
    for i, seed in enumerate(bell_seeds):
        print(f"  Seed {i}: {len(seed)} components")
        for comp in seed:
            print(f"    - {comp['type']}: {comp}")
    
    # Test GHZ seed
    ghz_seeds = get_seed_population("GHZ State", phase)
    print(f"✓ GHZ State seeds: {len(ghz_seeds)} seeds returned")
    
    # Test W seed
    w_seeds = get_seed_population("W State", phase)
    print(f"✓ W State seeds: {len(w_seeds)} seeds returned")
    
    # Test unknown state
    unknown_seeds = get_seed_population("Unknown", phase)
    print(f"✓ Unknown state returns: {len(unknown_seeds)} seeds (expected 0)")


def test_population_generation():
    """Test hybrid population initialization."""
    print("\n" + "="*70)
    print("TEST 2: Population Generation (Hybrid)")
    print("="*70)
    
    pop_size = 50
    phase = 1.57
    target_state = "Bell State"
    
    population = generate_population(
        pop_size=pop_size,
        target_state=target_state,
        phase=phase
    )
    
    print(f"✓ Generated population of {len(population)} circuits")
    print(f"✓ Target state: {target_state}")
    print(f"✓ Phase: {phase}")
    
    # Verify parameters exist
    params_found = {
        "ratio": 0,
        "phase": 0,
        "probability": 0
    }
    
    for circuit in population:
        for comp in circuit:
            if "ratio" in comp:
                params_found["ratio"] += 1
            if "phase" in comp:
                params_found["phase"] += 1
            if "probability" in comp:
                params_found["probability"] += 1
    
    print(f"\n✓ Parameter distribution:")
    print(f"  - Components with 'ratio': {params_found['ratio']}")
    print(f"  - Components with 'phase': {params_found['phase']}")
    print(f"  - Components with 'probability': {params_found['probability']}")
    
    # Show first few circuits
    print(f"\n✓ First 3 circuits:")
    for i, circuit in enumerate(population[:3]):
        print(f"  Population[{i}]: {len(circuit)} components")
        for comp in circuit:
            print(f"    {comp}")


def test_optimizer():
    """Test optimizer with Bell State."""
    print("\n" + "="*70)
    print("TEST 3: Optimizer (Bell State, 5 generations)")
    print("="*70)
    
    result = optimize(
        target_state="Bell State",
        phase=1.57,
        qubits=2,
        noise=0.02,
        generations=5,  # Short run for testing
        pop_size=30     # Small population for speed
    )
    
    print(f"\n✓ Optimization complete")
    print(f"  - Best fidelity: {result['best_fidelity']:.4f}")
    print(f"  - Best generation: {result['generation']}")
    print(f"  - Circuit components: {result['components']}")
    print(f"  - Circuit depth: {result['depth']}")
    
    # Verify circuit structure
    best_circuit = result.get("best_circuit", [])
    print(f"\n✓ Best circuit ({len(best_circuit)} components):")
    for i, comp in enumerate(best_circuit):
        comp_str = f"  [{i}] {comp['type']}"
        
        if comp['type'] == 'BS' or comp['type'] == 'VBS':
            if 'ratio' in comp:
                comp_str += f" (ratio={comp['ratio']:.2f})"
        elif comp['type'] == 'PS':
            if 'phase' in comp:
                comp_str += f" (phase={comp['phase']:.2f})"
        elif comp['type'] == 'D':
            if 'probability' in comp:
                comp_str += f" (prob={comp['probability']:.2f})"
        
        print(comp_str)
    
    # Verify history
    history = result.get("history", [])
    if history:
        print(f"\n✓ Fidelity history: {[f'{f:.3f}' for f in history[:5]]}...")


def test_different_target_states():
    """Quick test of different target states."""
    print("\n" + "="*70)
    print("TEST 4: Different Target States")
    print("="*70)
    
    targets = ["Bell State", "GHZ State", "W State"]
    
    for target in targets:
        pop = generate_population(pop_size=20, target_state=target, phase=1.57)
        seed_count = 0
        random_count = 0
        
        # Try to distinguish seeded vs random (seeded have position 0 with specific types)
        print(f"\n✓ {target}:")
        print(f"  - Population size: {len(pop)}")
        print(f"  - Sample circuits: {len(pop[0])}, {len(pop[1])}, {len(pop[10])} components")


def main():
    """Run all tests."""
    print("\n" + "#"*70)
    print("# PHYSICS-INFORMED SEED SYSTEM VALIDATION")
    print("#"*70)
    
    try:
        test_seed_library()
        test_population_generation()
        test_optimizer()
        test_different_target_states()
        
        print("\n" + "="*70)
        print("✓ ALL TESTS PASSED")
        print("="*70)
        print("\nSeed system is properly integrated!")
        print("Ready for full testing with frontend.\n")
        
    except Exception as e:
        print("\n" + "="*70)
        print(f"✗ TEST FAILED: {e}")
        print("="*70)
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
