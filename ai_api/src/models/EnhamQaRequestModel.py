from pydantic import BaseModel
from typing import List, Optional
from .Options import Option

class EnhamQaRequestModel(BaseModel):
    user_message: str