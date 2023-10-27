import unittest
from unittest.mock import patch, Mock

import gpt_script


class TestGPTAssistant(unittest.TestCase):

    @patch('gpt_script.openai.ChatCompletion.create')
    def test_query_via_api(self, mock_create):
        # Mock the response from the OpenAI API
        mock_create.return_value = {
            'choices': [{'message': {'content': 'mock response'}}]
        }
        assistant = gpt_script.GPTAssistant(api_key='fake-api-key')
        response = assistant.query_via_api('test query')
        self.assertEqual(response, 'mock response')

    @patch('gpt_script.requests.post')
    def test_query_via_rest(self, mock_post):
        # Mock the response from the requests.post call
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [{'message': {'content': 'mock response'}}]
        }
        mock_post.return_value = mock_response
        assistant = gpt_script.GPTAssistant(api_key='fake-api-key')
        response = assistant.query_via_rest('test query')
        self.assertEqual(response, 'mock response')

    def test_format_query(self):
        assistant = gpt_script.GPTAssistant(api_key='fake-api-key')
        formatted_query = assistant.format_query('test string')
        self.assertIn('test string', formatted_query)


if __name__ == '__main__':
    unittest.main()
