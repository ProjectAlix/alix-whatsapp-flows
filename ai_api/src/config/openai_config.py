from dotenv import load_dotenv
import os
from openai import OpenAI
load_dotenv()
api_key=os.environ.get("OPENAI_API_KEY")
openai=OpenAI(api_key=api_key)