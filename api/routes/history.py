import os
import sys
from fastapi import APIRouter, HTTPException

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from storage.investigation_store import get_recent_investigations

router = APIRouter(prefix="/history", tags=["History"])


@router.get("")
def get_history(limit: int = 50):
    """
    Retrieve recent fraud investigations saved to Pinecone.
    Returns investigations sorted by timestamp (most recent first).
    """
    try:
        return {"investigations": get_recent_investigations(limit=limit)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
