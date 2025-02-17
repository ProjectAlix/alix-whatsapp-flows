from fastapi import APIRouter
from ..models.EnhamQaRequestModel import EnhamQaRequestModel
from ..models.SignpostingRequest import SignpostingRequest
from ..services.AI_Service import VertexAI_Service, OpenAI_Service
from ..services.TranslationService import TranslationService
import logging
router=APIRouter(
    prefix='/llm'
)

@router.post("/signposting-golding")
def create_signposting_messages(request_body: SignpostingRequest):
    options=[option.model_dump(by_alias=True) for option in request_body.options]
    try:
        llm_service=VertexAI_Service("vertexai", "gemini-1.5-flash-001")
        messages=llm_service.describe_signposting_options(options, request_body.category)
        if (request_body.language!="en"):
            messages=[TranslationService(request_body.language).translate_text(message) for message in messages]
        print(len(messages))
        return {"message": "success", "data":messages}
    except Exception as e:
        logging.error(f"An error occurred in LLM Service: {e}")
        return {"message":"error", "data":[]}

@router.post("/signposting-alix")
def create_signposting_messages(request_body: SignpostingRequest):
    options=[option.model_dump(by_alias=True) for option in request_body.options]
    try:
        llm_service=VertexAI_Service("vertexai", "gemini-1.5-flash-001")
        messages=llm_service.describe_signposting_options(options, request_body.category)
        if (request_body.language!="en"):
            messages=[TranslationService(request_body.language).translate_text(message) for message in messages]
        print(len(messages))
        return {"message": "success", "data":messages}
    except Exception as e:
        logging.error(f"An error occurred in LLM Service: {e}")
        return {"message":"error", "data":[]}


@router.post("/enham-qa")
def answer_enham_qa(request_body: EnhamQaRequestModel):
    llm=OpenAI_Service("openai")
    try:
        thread_id=llm.create_thread(user_message=request_body.user_message)
        response=llm.create_run("enham", thread_id)
        return {"message":"success", "data":response.data[0].content[0].text.value}
    except Exception as e:
        logging.error(f"Error occurred in Enham Assistant service: {e}")
        return {
            "message":"error", 
            "data":None
        }
