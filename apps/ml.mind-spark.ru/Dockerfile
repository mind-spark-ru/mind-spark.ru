FROM python:3.12-slim

RUN pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* README.md ./
COPY app/__init__.py app/

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-ansi

COPY app/ ./app/

CMD ["python3", "app/main.py"]
