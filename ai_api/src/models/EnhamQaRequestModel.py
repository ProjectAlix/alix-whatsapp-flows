from pydantic import BaseModel


class EnhamQaRequestModel(BaseModel):
    user_message: str