import sys
import os

# Make ml/ importable (for optimizer, config, etc.) and project root importable (for physics)
_ML_DIR      = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.abspath(os.path.join(_ML_DIR, ".."))
for _p in [_ML_DIR, _PROJECT_ROOT]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import json
from optimizer import run_optimizer
from utils import format_circuit


def main():
    try:
        result = run_optimizer(target="BELL", max_components=4, generations=20)
        
        print("\n" + "="*60)
        print("OPTIMIZATION RESULTS")
        print("="*60)
        
        print("\nBest Circuit:")
        print(f"  {format_circuit(result['best_circuit'])}")
        
        print("\nBest Fidelity:")
        print(f"  {result['best_fidelity']:.4f}")
        
        print("\nHistory (Generation-wise Best):")
        print(f"  {result['history']}")
        
        print("\nTop Circuits:")
        for i, circuit_data in enumerate(result['top_circuits'], 1):
            score = circuit_data['score']
            circuit = circuit_data['circuit']
            print(f"  {i}. {format_circuit(circuit)} | Fidelity: {score:.4f}")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"Error during execution: {e}")

if __name__ == "__main__":
    main()
