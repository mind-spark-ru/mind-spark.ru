import numpy as np
import torch
from transformers import AutoModel, AutoTokenizer

from app.core.config import settings


class EmbeddingService:
    def __init__(self, model_name: str) -> None:
        self.model_name = model_name
        self.model = None
        self.tokenizer = None
        self.device = None

    def load_model(self) -> None:
        try:
            if torch.backends.mps.is_available():
                self.device = torch.device("mps")
            else:
                self.device = torch.device("cpu")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model.to(self.device)
            self.model.eval()
        except Exception as e:
            raise ValueError(e)

    def get_embedding(self, text: str) -> list[np.ndarray]:
        if self.model is None:
            self.load_model()
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
        ).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
            embedding = outputs.last_hidden_state.mean(dim=1).squeeze()
        return embedding.cpu().numpy()

    def get_embedding_list(self, text: str) -> list[float]:
        embedding = self.get_embedding(text)
        return embedding.tolist()


embedding_service = EmbeddingService(settings.EMBEDDING_MODEL)
