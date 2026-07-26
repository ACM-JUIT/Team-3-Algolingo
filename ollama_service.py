import requests
import json
from typing import Optional

class OllamaService:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "llama3.2"
    
    def generate_response(self, prompt: str) -> Optional[str]:
        """Generate a response from Llama3.2 model"""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.7,
                },
                timeout=30
            )
            if response.status_code == 200:
                return response.json().get("response", "")
            return None
        except Exception as e:
            print(f"Ollama error: {e}")
            return None
    
    def generate_question_explanation(self, question: str, answer: str) -> str:
        """Use Llama3.2 to generate explanations for incorrect answers"""
        prompt = f"Briefly explain why this answer is wrong for the programming question:\n\nQ: {question}\nAnswer: {answer}"
        return self.generate_response(prompt) or "Unable to generate explanation"
    
    def validate_code_answer(self, code: str, expected_output: str) -> str:
        """Use Llama3.2 to validate code solutions"""
        prompt = f"Review this code solution and expected output:\n\nCode:\n{code}\n\nExpected: {expected_output}\n\nIs this correct?"
        return self.generate_response(prompt) or "Unable to validate"

ollama_service = OllamaService()
