FROM python:3.11-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    cmake \
    build-essential \
    curl \
    git \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

COPY ml.mind-spark.ru/ .

RUN pip install --no-cache-dir poetry

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction

RUN poetry install 

CMD ["python", "app/main.py"]