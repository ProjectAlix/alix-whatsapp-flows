from fastapi import APIRouter, Depends, HTTPException, status
from ..models.TranscriptionDataModel import TranscriptionDataModel
from ..services.SpeechToTextService import SpeechToTextService
from ..services.DatabaseService import get_database_service, DatabaseService    
from pymongo import errors
router=APIRouter(prefix="/tasks")

@router.post("/transcription")
def create_transcription(
    request_body: TranscriptionDataModel,
    db_service: DatabaseService = Depends(get_database_service),
):
    """
    Creates a transcription from a media URL and updates the database with the transcription and its storage URI.

    This endpoint processes a transcription request by:
    - Fetching audio from the given media URL.
    - Transcribing the audio using the `SpeechToTextService`.
    - Storing the transcription text and its associated GCS (Google Cloud Storage) URI in the database.

    Args:
        request_body (TranscriptionDataModel): The request payload containing the media URL and message SID.
        db_service (DatabaseService, optional): An instance of the `DatabaseService` to handle database operations. Injected using `Depends`.

    Returns:
        dict: A JSON response containing the success message and status code.

    Raises:
        HTTPException: If a database error occurs or any other exception is raised during processing.

    Example Request:
        {
            "MediaUrl0": "https://example.com/audio-file.mp3",
            "MessageSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }

    Example Response:
        {
            "message": "Message updated successfully with TranscriptionText",
            "status": 200
        }

    External References:
        - :py:meth:`~services.SpeechToTextService.handle_transcription`: Handles the audio transcription process.
        - :py:meth:`~services.DatabaseService.update_message_text`: Updates the transcription and URI in the MongoDB database.
    """
    media_url=request_body.MediaUrl0
    message_sid=request_body.MessageSid
    speech_to_text_service=SpeechToTextService()
    try:
        # Generate transcription and GCS URI using the transcription service
        transcription, gcs_uri=speech_to_text_service.handle_transcription(media_url)
        print(gcs_uri)
        # Update survey response record in the database with message transcription
        db_service.update_message_text(message_sid, transcription, gcs_uri)
        return {"message": f"Message updated successfully with {transcription}", "status": 200}
    except errors.PyMongoError as db_error: 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in database: {db_error}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred: {e}")

    
