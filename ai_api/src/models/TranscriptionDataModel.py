from pydantic import BaseModel

class TranscriptionDataModel(BaseModel):
    MediaUrl0: str
    MessageSid: str
    