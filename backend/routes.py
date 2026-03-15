"""
routes.py
---------
API routes for quantum circuit optimization endpoints.
"""

from fastapi import APIRouter, HTTPException
from backend.schemas import InputData, PredictionResponse
from backend.services import run_optimization

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict(data: InputData) -> PredictionResponse:
    """
    POST /predict
    
    Accepts quantum circuit parameters and returns optimized circuit with fidelity.
    
    Request body:
        {
            "qubits": int (1-10),
            "phase": float (0.0-1.0),
            "noise": float (0.0-1.0)
        }
    
    Response:
        {
            "best_fidelity": float,
            "circuit": list[str]
        }
    """
    try:
        result = run_optimization(data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Optimization failed: {str(e)}"
        )
