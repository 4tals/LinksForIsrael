import logging
import os

import openai
import requests

logging.basicConfig(level=logging.INFO)


class GPTAssistant:
    def __init__(self, api_key: str = None, model: str = 'gpt-4'):
        self.api_key = api_key or os.environ.get('OPENAI_API_KEY')  # Get the API key from the argument or environment
        if self.api_key is None:
            raise ValueError(
                "No API key provided. Set the OPENAI_API_KEY environment variable or pass the api_key argument.")
        self.model = model
        openai.api_key = self.api_key  # Set the OpenAI API key using the correct value

    def format_query(self, text_string: str) -> str:
        base_query = """
        {
            "name": "HamalMeida",
            "displayName": "החזית האזרחית - The Civilian Front",
            "shortDescription": "",
            "description": "בצוות איכותי וערכי של מתנדבים אזרחים שעובדים מסביב לשעון בשביל להלחם בחזית ההסברתית",
            "url": "https://chat.whatsapp.com/LGKPchQGakg4E75XYfEfyS",
            "whatsapp": "https://chat.whatsapp.com/LGKPchQGakg4E75XYfEfyS",
            "telegram": "https://t.me/s/amitsegal",
            "discord": "https://discord.com/channels/foo",
            "tiktok": "https://chat.whatsapp.com/Hw7fdndJdYy6TPsDii9o5V",
            "twitter": "https://chat.whatsapp.com/Ez1hDNEt0OZF5a9sGgYueO",
            "instagram": "https://www.instagram.com/p/Cyc7OYkAbdi/?igshid=MTc4MmM1YmI2Ng%3D%3D",
            "facebook": "https://www.facebook.com/haogen4families",
            "drive": https://drive.google.com/drive/folders/19up1kQTiAh-7vXuIgBHklYuNW-Va63_Y,
            "form": "https://docs.google.com/forms/d/e/1FAIpQLSeB2Ws2_21qvwhfb1aFDhTB0DQSsuyFL4jRIBoSYFHQV7P7xQ/viewform",
            "docs": "https://docs.google.com/forms/d/e/1FAIpQLSe63ECMBD1YEmAbLovFTvpxek46ZCSuKV9N2mT-G27tTwN2hA/viewform",
            "phone":"0502210169",
            "tags": ["סושיאל","אינסטגרם","פייסבוק","טוויטר","טיקטוק","הסברה"]
        },
        
        Using the record structure above. Please take the proceeding info and generate record using the following guidelines:
        
        Record Creation Instructions
        Using the provided user record structure, generate a new record by adhering to the following guidelines:
        
        Remove Empty Keys: Ensure that no key in the record has an empty or null value.
        Tag Optimization: Format the tags in Hebrew to aid in efficient searching.
        Name Fields in Hebrew: If possible, provide the "displayName" and "description" fields primarily in Hebrew.
        Description Length: Ensure that the "description" field does not exceed 120 characters in length.
        If exists add initiative Validation description in hebrew upto 120 chars.
        If a value for a key is empty or "No response", we can just remove it.
        Please limit the response only to the output json.
        """
        formatted_query = base_query + '\n\n The msg that should be formatted is:\n```' + text_string + '```'
        return formatted_query

    def query_via_api(self, text_string: str) -> str:
        query = self.format_query(text_string)
        conversation = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": query}
        ]
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=conversation
        )
        answer = response['choices'][0]['message']['content']
        return answer

    def query_via_rest(self, text_string: str) -> str:
        query = self.format_query(text_string)
        endpoint = 'https://api.openai.com/v1/chat/completions'
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        conversation = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": query}
        ]
        body = {
            'model': self.model,
            'messages': conversation
        }
        response = requests.post(endpoint, headers=headers, json=body)
        response_json = response.json()
        answer = response_json['choices'][0]['message']['content']
        return answer


def get_initiative_details():
    issue_body = os.environ['ISSUE_BODY']
    logging.info("Issue body:\n" + issue_body + "\n")
    return issue_body


def output_response(response: str):
    print(response)
    logging.info('GPT Response:\n' + response + "\n")


if __name__ == "__main__":
    logging.info("Initializing GPT Assistant.")
    assistant = GPTAssistant()
    initiative_details = get_initiative_details()
    use_rest = True
    try:
        if use_rest:
            logging.info("Querying via REST.")
            response = assistant.query_via_rest(initiative_details)
            output_response(response)
        else:
            logging.info("Querying via OpenAI API.")
            response = assistant.query_via_api(initiative_details)
            output_response(response)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
