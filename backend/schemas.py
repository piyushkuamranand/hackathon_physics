"""
schemas.py
----------
Pydantic schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


class InputData(BaseModel):
    """
    Input schema for quantum circuit optimization.
    
    Parameters
    ----------
    qubits : int
        Number of qubits (number of quantum components in circuit).
    phase : float
        Phase parameter for the quantum circuit (0.0 to 1.0).
    noise : float
        Noise level parameter (0.0 to 1.0).
    """
    
    qubits: int = Field(..., ge=1, le=10, description="Number of qubits")
    phase: float = Field(..., ge=0.0, le=1.0, description="Phase parameter")
    noise: float = Field(..., ge=0.0, le=1.0, description="Noise level")
    target_state: str = Field(..., description="Target quantum state (e.g., BELL, GHZ, W)")


class PredictionResponse(BaseModel):
    """
    Output schema for optimization result.
    
    Parameters
    ----------
    best_fidelity : float
        Best fidelity value achieved.
    circuit : list[str]
        Optimized circuit as list of component names.
    generation: int
        Generations it took to optimize.
    """
    
    best_fidelity: float = Field(..., ge=0.0, le=1.0, description="Best fidelity")
    circuit: list = Field(..., description="Optimized circuit components")
    generation: int = Field(..., description="Generations passed to optimize")
