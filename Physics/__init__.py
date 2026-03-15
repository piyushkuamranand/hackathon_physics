"""
physics/__init__.py
-------------------
Convenience re-exports so callers can write:

    from physics import evolve_state, fidelity, get_target_state, simulate_circuit
"""

from physics.physics_engine import (   # noqa: F401
    evolve_state,
    fidelity,
    get_target_state,
    simulate_circuit,
)
