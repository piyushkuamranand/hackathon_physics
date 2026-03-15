pip install numpy scikit-learn fastapi uvicornimport sys
import copy
import random
import json

from ml.population import generate_population
from ml.mutation import mutate_circuit, mutate_component_parameter
from ml.fitness import evaluate_circuit_fidelity
from ml.optimizer import optimize
from pydantic import ValidationError
from backend.schemas import InputData
from backend.services import run_optimization
from Physics.component_mapper import evaluate_circuit_physics

print("========== EDGE CASE 2 & 3: SENSITIVITY TESTS ==========")
c1 = [{"type": "BS", "ratio": 0.5}, {"type": "PS", "phase": 1.57}, {"type": "D"}, {"type": "D"}]
c2 = [{"type": "BS", "ratio": 0.5}, {"type": "PS", "phase": 2.50}, {"type": "D"}, {"type": "D"}]
c3 = [{"type": "BS", "ratio": 0.70}, {"type": "PS", "phase": 1.57}, {"type": "D"}, {"type": "D"}]

f1, p1, a1 = evaluate_circuit_physics(c1)
f2, p2, a2 = evaluate_circuit_physics(c2)
f3, p3, a3 = evaluate_circuit_physics(c3)
print(f"Phase 1.57 Fidelity: {f1}, Probs: {p1}")
print(f"Phase 2.50 Fidelity: {f2}, Probs: {p2}")
print(f"Ratio 0.70 Fidelity: {f3}, Probs: {p3}")

print("\n========== EDGE CASE 4: DETECTOR CONSERVATION ==========")
print(f"P1 (1.57): {sum(p1.values())}")
print(f"P3 (0.70): {sum(p3.values())}")

print("\n========== EDGE CASE 6 & 11: SEED DOMINANCE & GA EVOLUTION ==========")
res = optimize(target_state="Bell State", phase=1.57, qubits=2, noise=0.02, generations=10, pop_size=20)
print(f"Generations Run: {res['generation']}")
print("Final Best Circuit Parameters:", json.dumps(res['best_circuit'], indent=2))
print("Final Best Fidelity:", res['best_fidelity'])

print("\n========== EDGE CASE 7: RANDOM INPUT STABILITY ==========")
res2 = optimize(target_state="Bell State", phase=1.57, qubits=2, noise=0.02, generations=5, pop_size=20)
res3 = optimize(target_state="Bell State", phase=1.57, qubits=2, noise=0.02, generations=5, pop_size=20)
print(f"Run 2 Best Fidelity: {res2['best_fidelity']}")
print(f"Run 3 Best Fidelity: {res3['best_fidelity']}")

print("\n========== EDGE CASE 12: IMPOSSIBLE INPUT ==========")
try:
    InputData(phase=999, noise=-1)
    print("FAILED: Pydantic allowed bad data")
except ValidationError as e:
    print("PASSED: Pydantic correctly rejected bad data")
    print(e)
