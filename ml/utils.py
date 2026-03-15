import random
import sys
import os

_ML_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from ml.config import ALLOWED_COMPONENTS

def get_random_component():
    return random.choice(ALLOWED_COMPONENTS)

def format_circuit(circuit):
    """Return readable circuit format: BS → HWP(45) → PHASE(90)"""
    return " → ".join(circuit)
