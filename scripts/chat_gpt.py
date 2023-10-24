import requests
from typing import Dict

YOUR_OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"


def call_gpt4(query: str) -> Dict:
    """
    Calls GPT-4 with a query and returns the response.

    Args:
        query (str): The input query for GPT-4.

    Returns:
        Dict: The response from GPT-4.
    """
    endpoint = "https://api.openai.com/v1/engines/davinci/completions"  # this might change, you need to check the official documentation
    headers = {
        "Authorization": f"Bearer {YOUR_OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "prompt": query,
        "max_tokens": 150  # you can adjust this value as needed
    }
    response = requests.post(endpoint, headers=headers, json=data)
    return response.json()


if __name__ == "__main__":
    query_str = input("Enter your query: ")
    response = call_gpt4(query_str)
    print(response['choices'][0]['text'].strip())
