FROM python:3.11-slim

WORKDIR /app

COPY api.mind-spark.ru/ .

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction

RUN poetry install 


CMD ["python", "app/main.py"]