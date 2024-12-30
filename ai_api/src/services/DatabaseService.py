import os
from pymongo import MongoClient, errors
from dotenv import load_dotenv
load_dotenv()
MONGO_URI=os.environ.get("MONGO_URI")
DB_NAME=os.environ.get("DB_NAME", "controlRoomDB_dev")

class DatabaseService:
    def __init__(self, db):
        try: 
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[db]
        except errors.ConnectionFailure as e:
            print("error connecting to MongoDB")
            raise
    
    def close(self):
        self.client.close()

    def update_message_text(self, message_sid, transcription, gcs_uri):
        message_collection=self.db["messages"]
        flow_history_collection=self.db["flow_history"]
        contacts_collection=self.db["contacts"]
        try:
           message_collection.update_one({"MessageSid": message_sid}, {"$set": {"Body": transcription, "gcsAudioUri": gcs_uri} } )
           flow_history_collection.update_one(         {
                "flowResponses.originalMessageSid": message_sid  # Filter to find the document
            },
            {
                "$set": {
                    "flowResponses.$.userResponse": f"<transcript>{transcription}</transcript>", 
                    "flowResponses.$.gcsAudioUri":gcs_uri
                      
                          # Set the new userResponse for the matched element
                }
            })
           print(f"Message {message_sid} body updated to {transcription}")
           contact = contacts_collection.find_one({
            "$expr": {
                "$anyElementTrue": {
                    "$map": {
                        "input": {"$objectToArray": "$EnhamPA_profile"},
                        "as": "field",
                        "in": {
                            "$eq": ["$$field.v.originalMessageSid", message_sid]
                        }
                    }
                }
            }
        })
           if contact:
            print("Contact found for message SID:", contact)

            # Iterate through EnhamPA_profile to handle both arrays and objects
            for field, data in contact.get("EnhamPA_profile", {}).items():
                # If it's an array, check if the message SID exists in the array elements
                if isinstance(data, list):
                    for i, item in enumerate(data):
                        if item.get("originalMessageSid") == message_sid:
                            update_path = f"EnhamPA_profile.{field}.{i}.value"
                            contacts_collection.update_one(
                                {"_id": contact["_id"]},
                                {"$set": {update_path: transcription}}
                            )
                            print(f"Updated array field '{field}' at index {i} with value: {transcription}")
                            break
                # If it's a single object, just check and update it
                elif isinstance(data, dict) and data.get("originalMessageSid") == message_sid:
                    update_path = f"EnhamPA_profile.{field}.value"
                    contacts_collection.update_one(
                        {"_id": contact["_id"]},
                        {"$set": {update_path: transcription}}
                    )
                    print(f"Updated object field '{field}' with value: {transcription}")
                    break   
        except errors.PyMongoError as e: 
            print(f"Error in update operation: {e}")

    

def get_database_service():
    db_service = DatabaseService(DB_NAME)  # Replace with your database name
    try:
        yield db_service
    finally:
        db_service.close()