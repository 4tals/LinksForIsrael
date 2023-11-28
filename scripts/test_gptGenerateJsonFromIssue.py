import unittest
from unittest.mock import patch, Mock

import scripts.gptGenerateJsonFromIssue as gptGenerateJsonFromIssue


class TestGPTAssistant(unittest.TestCase):

    @patch('gptGenerateJsonFromIssue.openai.ChatCompletion.create')
    def test_query_via_api(self, mock_create):
        # Mock the response from the OpenAI API
        mock_create.return_value = {
            'choices': [{'message': {'content': 'mock response'}}]
        }
        assistant = gptGenerateJsonFromIssue.GPTAssistant(api_key='fake-api-key')
        response = assistant.query_via_api('test query')
        self.assertEqual(response, 'mock response')

    @patch('gptGenerateJsonFromIssue.requests.post')
    def test_query_via_rest(self, mock_post):
        # Mock the response from the requests.post call
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [{'message': {'content': 'mock response'}}]
        }
        mock_post.return_value = mock_response
        assistant = gptGenerateJsonFromIssue.GPTAssistant(api_key='fake-api-key')
        response = assistant.query_via_rest('test query')
        self.assertEqual(response, 'mock response')

    def test_format_query(self):
        assistant = gptGenerateJsonFromIssue.GPTAssistant(api_key='fake-api-key')
        formatted_query = assistant.format_query('test string')
        self.assertIn('test string', formatted_query)


if __name__ == '__main__':
    unittest.main()
