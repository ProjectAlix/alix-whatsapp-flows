from fastapi import APIRouter
from typing import List
from ..models.SignpostingRequestModel import SignpostingRequestModel
from ..models.EnhamQaRequestModel import EnhamQaRequestModel
from ..models.SignpostingRequest import SignpostingRequest
from ..services.AI_Service import VertexAI_Service, OpenAI_Service
from ..services.TranslationService import TranslationService
from ..utils.formatting import create_input_text
import logging
router=APIRouter(
    prefix='/llm'
)

@router.post("/")
def describe_signposting_options(request_body: SignpostingRequestModel)->List[str]:
    """
    Processes input through a Language Model (LLM) and returns the generated messages (descriptions for signposting options).

    This endpoint accepts a structured request body containing options, category, and language.
    It processes the options to generate input text, calls the Vertex AI LLM service to
    process the messages, and optionally translates the messages into a target language.

    Args:
        request_body (SignpostingRequestModel): The input payload containing user options, category, and language.

    Returns:
        list[str]: A list of processed and optionally translated messages.
    
    Related Functions:
    - :py:func:`~utils.formatting.create_input_text` - Formats an option into a string for LLM input.
    - :py:meth:`~services.AI_Service.VertexAI_Service.process_messages` - Sends processed input to the Vertex AI service.
    - :py:meth:`~services.TranslationService.TranslationService.translate_text` - Translates text into the specified language.

    
    Example Request:
{
    "options": [
        {
            "Category tags": ["#debt-advice", "#budget-advice", "#benefits-advice"],
            "Name": "Step Change",
            "Website": "https://www.stepchange.org/",
            "Phone - call": "0800 138 1111",
            "Local / National": "National",
            "Postcode": "",
            "Short text description": "Offers free comprehensive debt advice to support individuals gain financial control and stability",
            "Logo-link": "https://drive.google.com/uc?export=download&id=------",
            "Email": "",
            "latitude": null,
            "longitude": null
        }
    ],
    "category": "benefits-advice", 
    "language":"en"
}
    Example Response:
        [
           "Step Change is a national organization that provides free, 
           comprehensive debt advice to help individuals manage their finances and regain control. 
           They offer a range of services, including budgeting support, debt management plans, 
           and advice on dealing with creditors. \n\nWebsite: https://www.stepchange.org/\nLocation: National"
        ]
    """
    # Process each option in the request body into a formatted input string
    processed_options = [create_input_text(option.model_dump(by_alias=True)) for option in request_body.options]
    # Initialize Vertex AI with the Gemini model
    llm_service=VertexAI_Service("vertexai", "gemini-1.5-flash-001")
    # Generate messages using the Vertex AI Service class
    messages=llm_service.process_messages(processed_options, request_body.category)
    # Translates messages if user language is not English
    if (request_body.language!="en"):
        messages=[TranslationService(request_body.language).translate_text(message) for message in messages]
    print(messages)
    return messages
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
