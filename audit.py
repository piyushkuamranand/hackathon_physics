import sys
import copy
import random
import json

from ml.population import generate_population
from ml.mutation import mutate_circuit, mutate_component_parameter
from ml.fitness import evaluate_circuit_fidelity
from ml.optimizer import optimize
from backend.services import run_optimization
from backend.schemas import InputData

print("===========================================")
print("STEP 1: Verify Seed Population Is Loaded")
pop = generate_population(pop_size=5, target_state="Bell State", phase=1.57)
print("INITIAL POPULATION:")
for i, p in enumerate(pop[:3]):
    print(f"  Circuit {i}: {p}")

print("\n===========================================")
print("STEP 2: Verify Mutation Changes Parameters")
test_comp_ps = {"type": "PS", "phase": 1.57, "position": 0}
test_comp_bs = {"type": "BS", "ratio": 0.5, "position": 1}
print("Before mutation PS:", test_comp_ps)
mut_ps = copy.deepcopy(test_comp_ps)
mut_ps = mutate_component_parameter(mut_ps)
print("After mutation PS:", mut_ps)
print("Before mutation BS:", test_comp_bs)
mut_bs = copy.deepcopy(test_comp_bs)
mut_bs = mutate_component_parameter(mut_bs)
print("After mutation BS:", mut_bs)

print("\n===========================================")
print("STEP 3 & 7: Verify Physics Uses Parameters & Perturbation Test")
circuit_p1 = [{"type": "BS", "ratio": 0.5}, {"type": "PS", "phase": 1.57}, {"type": "BS", "ratio": 0.5}]
circuit_p2 = [{"type": "BS", "ratio": 0.5}, {"type": "PS", "phase": 2.5}, {"type": "BS", "ratio": 0.5}]

fid1 = evaluate_circuit_fidelity(circuit_p1, qubits=2, phase=1.57, noise=0.0)
fid2 = evaluate_circuit_fidelity(circuit_p2, qubits=2, phase=2.5, noise=0.0)

print(f"Fidelity w/ Phase=1.57: {fid1}")
print(f"Fidelity w/ Phase=2.5:  {fid2}")
print("Did it change?", "YES" if fid1 != fid2 else "NO")

print("\n===========================================")
print("STEP 4 & 5: Verify Best Individual Evolves & Backend Maps Output")
# Run a quick 10-gen optimization
res = optimize(target_state="Bell State", phase=1.57, qubits=2, noise=0.02, generations=10, pop_size=10)
print(f"Generations Run: {res['generation']}")
print("Final Best Circuit Parameters:", json.dumps(res['best_circuit'], indent=2))
print("Final Best Fidelity:", res['best_fidelity'])

print("\n===========================================")
print("STEP 8: Detector Physics Validation")
det_prob_sum = sum([c.get('probability', 0) for c in res['best_circuit'] if c.get('type') == 'D'])
print(f"Total Detector Probability Sum: {det_prob_sum} (Expect ~1.0 if detectors distribute probabilistically)")

print("\n===========================================")
print("Full backend wrapper response:")
req = InputData(target_state="Bell State", qubits=2, noise=0.02, phase=1.57, mode="balanced", depth=4)
svc_res = run_optimization(req)
print(json.dumps(svc_res.model_dump(), indent=2))
