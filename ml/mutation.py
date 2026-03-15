import random
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.config import ALLOWED_COMPONENTS


def mutate_circuit(circuit: list, max_components: int) -> list:
    """
    Mutate a circuit by randomly applying one of three operations:
      - replace : swap one component with a random allowed component
      - add     : insert a new component (only if len < max_components)
      - remove  : delete one component (only if len > 1)

    Always returns a valid, non-empty circuit.
    """
    # Safety: return copy if empty or None
    if not circuit:
        return [random.choice(ALLOWED_COMPONENTS)]
    
    mutated = circuit.copy()

    # Build the available actions based on current length
    actions = ["replace"]
    if len(mutated) < max_components:
        actions.append("add")
    if len(mutated) > 1:
        actions.append("remove")

    action = random.choice(actions)

    if action == "replace":
        # Safe: circuit is guaranteed non-empty at this point
        idx = random.randrange(len(mutated))
        # Pick a different component to guarantee actual change
        current = mutated[idx]
        choices = [c for c in ALLOWED_COMPONENTS if c != current]
        mutated[idx] = random.choice(choices) if choices else random.choice(ALLOWED_COMPONENTS)

    elif action == "add":
        idx = random.randint(0, len(mutated))      # 0 … len (inclusive)
        mutated.insert(idx, random.choice(ALLOWED_COMPONENTS))

    else:  # remove
        # Safe: only called if len(mutated) > 1
        idx = random.randrange(len(mutated))
        mutated.pop(idx)

    return mutated
