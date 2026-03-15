"""
config.py
---------
Configuration constants for quantum circuit optimizer.
"""

# Population and Evolution Parameters
POPULATION_SIZE = 50
MUTATION_RATE = 0.15
DEFAULT_GENERATIONS = 20
MAX_COMPONENTS = 6
MIN_CIRCUIT_LENGTH = 2
MAX_CIRCUIT_LENGTH = 6

# Standard Keys
KEY_CIRCUIT = "circuit"

# Allowed quantum optical components (dictionary-based)
ALLOWED_COMPONENTS = [
    {"type": "BS", "ratio": 0.5},
    {"type": "PS", "phase": 1.57},
    {"type": "D", "probability": 0.5}
]

