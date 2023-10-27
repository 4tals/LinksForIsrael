import logging
import os
import sys

import openai
import requests

logging.basicConfig(level=logging.INFO)


class GPTAssistant:
    def __init__(self, api_key: str = None, model: str = 'gpt-4'):
        # Get the API key from the argument or environment
        self.api_key = api_key or os.environ.get('OPENAI_API_KEY')
        if self.api_key is None:
            raise ValueError(
                "No API key provided. Set the OPENAI_API_KEY environment variable or pass the api_key argument.")
        self.model = model
        openai.api_key = self.api_key  # Set the OpenAI API key using the correct value

    def format_query(self, text_string: str) -> str:
        base_query = """
        Our website is initiatives index that route people to the relevant initiatives. Our initiatives are stored as dictionary record. For Example:
        {
            "name": "ExampleName",
            "displayName": "Example Display Name",
            "shortDescription": "Example Short Description",
            "description": "A dedicated team of volunteers working around the clock for a cause.",
            "url": "https://example.com/group-chat",
            "initiativeValidationDetails": "Shared in a group chat. Seems like a legitimate account created over 8 years ago with nearly 11k subscribers.",
            "whatsapp": "https://chat.whatsapp.com/example",
            "telegram": "https://t.me/example",
            "discord": "https://discord.com/channels/example",
            "article": "https://example-news.com/search?q=example",
            "tiktok": "https://tiktok.com/@example",
            "twitter": "https://twitter.com/example",
            "instagram": "https://www.instagram.com/example/",
            "facebook": "https://www.facebook.com/example",
            "drive": "https://drive.google.com/drive/folders/example",
            "form": "https://docs.google.com/forms/d/example/viewform",
            "docs": "https://docs.google.com/forms/d/example/viewform",
            "tags": ["Social", "Instagram", "Facebook", "Twitter", "TikTok", "Advocacy"]
        }

        Using the provided record example structure, new initiative info to generate a new record by adhering to the 
        following guidelines:

        1. Remove Empty Keys: Ensure that no key in the record has an empty or null value.
        2. Tag Optimization: add hebrew tags about the relevant initiative, the tags should aid in efficient searching.
        3. If possible, provide the "displayName" and "description" fields in Hebrew.
        4. Ensure that the "description" field is between 110-130 characters in length.
        5. If exists add initiativeValidationDescription in hebrew upto between 110-130 chars
        6. If a value for a key is empty or "No response" don't add that key to the output response.
        7. Important, please limit the response only to the output json.
        """

        formatted_query = base_query + \
            '\n\n new initiative info is:\n```' + text_string + '```'
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
    sys.stderr.write('GPT Response:\n' + response + "\n")


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
