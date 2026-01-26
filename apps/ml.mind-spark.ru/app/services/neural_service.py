from llama_cpp import Llama

from app.core.config import settings
from app.core.prompts import prompts


class NeuralService:
    def __init__(self) -> None:
        self.llm = None
        self.system_prompt = prompts.system_prompt

    def load(self) -> None:
        self.llm = Llama(
            model_path=settings.model_path,
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
        prompt =  f"""
        {self.system_prompt}

        ПОЛЬЗОВАТЕЛЬ: {user_input}

        ОТВЕТ COACH MINDSHARK:
        """
        stream = self.llm(
        prompt,
        max_tokens=512,
        temperature=0.7,
        top_p=0.95,
        repeat_penalty=1.1,
        stop=["ПОЛЬЗОВАТЕЛЬ:", "ОТВЕТ COACH MINDSHARK:"],
        stream=True,
        )
        for output in stream:
            if output.get("choices"):
                token = output["choices"][0]["text"]
                if token:
                    yield token

    def _clean_response(self, text: str) -> str:
        return text

neural_service = NeuralService()
