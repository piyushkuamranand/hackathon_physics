import random
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.utils import get_random_component

def generate_individual(max_components):
    # Ensure valid range: at least 1, at most max_components
    safe_max = max(1, max_components)
    length = random.randint(1, safe_max)
    return [get_random_component() for _ in range(length)]

def generate_population(pop_size, max_components):
    return [generate_individual(max_components) for _ in range(pop_size)]
