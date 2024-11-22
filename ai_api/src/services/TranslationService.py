from ..config.translation_api_config import translate_client
class TranslationService:
    def __init__(self, target_language):
        self.client=translate_client
        self.target_language=target_language

    def translate_text(self, text):
        result = self.client.translate(text, self.target_language)
        return result["translatedText"]