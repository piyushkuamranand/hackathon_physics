"""
schemas.py
----------
Pydantic schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


from typing import Optional

class InputData(BaseModel):
    """
    Input schema for quantum circuit optimization.
    
    Parameters
    ----------
    qubits : int
        Number of qubits (1-10, affects circuit complexity).
    phase : float
        Phase parameter for the quantum circuit (0.0 to π, typically 0-3.14).
    noise : float
        Noise level parameter (0.0 to 1.0) for physics penalty.
    target_state : str
        Target quantum state: "Bell State", "GHZ State", "W State", or variants.
    """
    
    qubits: int = Field(..., ge=1, le=10, description="Number of qubits")
    phase: float = Field(..., ge=0.0, le=3.14, description="Phase parameter (radians)")
    noise: float = Field(..., ge=0.0, le=1.0, description="Noise level")
    target_state: str = Field(default="Bell State", description="Target quantum state")


class PredictionResponse(BaseModel):
    """
    Output schema for optimization result.
    
    Parameters
    ----------
    best_fidelity : float
        Best fidelity value achieved (0.0 to 1.0).
    circuit : list
        Optimized circuit as list of component dictionaries with parameters.
    generation : int
        Generation number where best result was found.
    components : int
        Total number of components in best circuit.
    depth : int
        Circuit depth (number of non-detector components).
    runtime : str
        Approximate runtime as string (e.g., "0.85s").
    """
    
    best_fidelity: Optional[float] = Field(None, description="Best fidelity achieved")
    circuit: list = Field(..., description="Optimized circuit components with parameters")
    generation: int = Field(default=0, description="Generation where best was found")
    components: int = Field(default=0, description="Number of components")
    depth: int = Field(default=0, description="Circuit depth")
    runtime: str = Field(default="0.0s", description="Optimization runtime")
    detector_probabilities: dict = Field(default_factory=dict, description="Detector probabilities")
    mode: str = Field(default="physical", description="Execution mode (preview or physical)")
    status: str = Field(default="success", description="Status string")
