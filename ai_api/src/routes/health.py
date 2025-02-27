from fastapi import APIRouter
import time
router=APIRouter(prefix='/health')
@router.get("")
def health_check():
    response={
        "status":"ok", "timestamp":time.time()
    }
    return response
