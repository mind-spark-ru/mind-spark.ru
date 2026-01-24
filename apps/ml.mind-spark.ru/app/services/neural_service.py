from llama_cpp import Llama

from app.core.config import settings


class NeuralService:
    def __init__(self) -> None:
        self.llm = None

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
        prompt = f"""Ты — умный помощник. Ответь на запрос.
        Запрос: {user_input}
        Ответ:"""
        output = self.llm(
        prompt,
        max_tokens=256,
        temperature=0.7,
        top_p=0.95,
        repeat_penalty=1.1,
        stream=False,
        )
        return str(output)

neural_service = NeuralService()
