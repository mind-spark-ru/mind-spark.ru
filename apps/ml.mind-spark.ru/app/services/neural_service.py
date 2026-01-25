from llama_cpp import Llama

from app.core.config import settings
from app.core.prompts import prompts


class NeuralService:
    def __init__(self) -> None:
        self.llm = None
        self.system_prompt = prompts.system_prompt

    def load(self) -> None:
        self.llm = Llama(
            model_path=settings.MODEL_PATH,
            n_ctx=4096,
            n_threads=8,
            n_batch=512,
            n_gpu_layers=0,
            use_mmap=True,
            use_mlock=True,
            vocab_only=False,
            verbose=False,
        )

    def chat(self, user_input: str) -> str:
        prompt =  f"""{self.system_prompt}

                ПОЛЬЗОВАТЕЛЬ: {user_input}

                COACH MINDSHARK:
                """
        output = self.llm(
        prompt,
        max_tokens=256,
        temperature=0.7,
        top_p=0.95,
        repeat_penalty=1.1,
        stop=["ПОЛЬЗОВАТЕЛЬ:", "USER:", "System:"],
        stream=False,
        )
        response = output['choices'][0]['text'].strip()
        return self._clean_response(response)
    
    def _clean_response(self, text: str) -> str:
        """Очистка ответа от артефактов"""
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            if not line.startswith('COACH MINDSHARK:') and not line.startswith('Ты — Coach MindSpark'):
                cleaned_lines.append(line)
        
        response = '\n'.join(cleaned_lines).strip()
        
        while '\n\n\n' in response:
            response = response.replace('\n\n\n', '\n\n')
            
        return response

neural_service = NeuralService()
