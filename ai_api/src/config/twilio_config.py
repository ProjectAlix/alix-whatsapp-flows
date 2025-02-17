import os
from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()
account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
twilio_client = Client(account_sid, auth_token)