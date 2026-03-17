![MindSpark](docs/images/logo.jpg)
<!-- TODO: замените заглушки на реальные скриншоты/гифки веба и мобильного приложения -->

# MindSpark
Персональный ИИ-коуч, который перезагружает мозг и тело: закрытая экосистема с локальным инференсом, уважением к приватности и борьбой с «дешевым дофамином».

## TL;DR (концепция)
- Персонализированный ИИ-коуч ведёт диалог, ставит микро-цели и визуализирует прогресс.
- Замкнутый контур: браслет MindSpark → поток биометрии → рекомендация → действие → обратная связь → адаптация модели.
- Приватность by design: свои модели, никакого внешнего AI API; инференс и данные остаются внутри.

## Ключевые возможности
- **Чат-коуч** в мобильном приложении (потоковые ответы, переключатели search/deep analysis).
- **Трекеры и дневник**: шаги, сон, калории, вода, пульс, стресс/спарк индекс, цели, заметки.
- **Онбординг и авторизация**: e-mail/пароль, коды подтверждения, Google OAuth, диплинк `mindspark://auth` для мобильного клиента.
- **Статистика/панель** (плейсхолдер): визуализация прогресса и корреляций.
- **ML-прослойка**: llama.cpp + GGUF, стриминг токенов через FastAPI.

## Архитектура (реальная структура)
- `apps/react.mind-spark.ru` — Web SPA (CRA + React Router) и точка входа для OAuth.
- `apps/react-native.mind-spark.ru` — Expo/React Native клиент (чаты, трекеры, диплинки).
- `apps/api.mind-spark.ru` — FastAPI backend: пользователи, сессии, Google OAuth, верификация, Redis-коды, PostgreSQL.
- `apps/ml.mind-spark.ru` — FastAPI inference с llama.cpp (GGUF-модель, стриминговые ответы).
- `docs/` — документы, изображения/медиа
- `private/` — закрытые материалы.

## Технологический стек (по сервисам)
- **Web**: React 19 (CRA), React Router 7.
- **Mobile**: Expo + React Native 0.81, React Navigation, AsyncStorage, кастомные анимации, диплинки `mindspark://`.
- **API**: FastAPI, async SQLAlchemy, PostgreSQL (asyncpg), Redis, JWT/Google OAuth, aiosmtplib, Alembic.
- **ML**: FastAPI + `llama-cpp-python`, GGUF модель в llama.cpp, `StreamingResponse` (SSE-подобный стрим).
- **DX/Quality**: Poetry, Ruff, Black, Isort, Mypy, pytest; npm/Expo Dev Client.
- **Важно**: Dockerfile/Compose в репозитории нет — ниже приведены шаблонные команды для сборки.

## Потоки данных
1) Браслет (план) → API → БД/Redis → рекомендации.  
2) Пользователь → Mobile/Web → API (аутентификация, верификация, Google OAuth) → токен → доступ к данным.  
3) Чат → Mobile → ML (`POST /v1/ml/predict?text=...`) → стриминг токенов → отображение и кеш в AsyncStorage.  
4) OAuth: Web `/auth` ↔ Google → callback → API → диплинк `mindspark://auth` в мобильное приложение.

## Структура репозитория
```
apps/
  react.mind-spark.ru/        # SPA + OAuth редиректы
  react-native.mind-spark.ru/ # Expo/React Native клиент
  api.mind-spark.ru/          # FastAPI: users/sessions/verification/google
  ml.mind-spark.ru/           # FastAPI + llama.cpp streaming
docs/                         # Плейсхолдеры для медиа
private/                      # Закрытые материалы
```

## Контейнеризация и оркестрация (фактически в репо: `apps/docker`, `apps/nginx`)
- Dockerfile: `apps/docker/*.Dockerfile` (api, ml, react, react-native, db, redis, nginx).
- Compose: `apps/docker/docker-compose.yaml` — сервисы postgres (db.Dockerfile), redis (redis.Dockerfile), api (api.Dockerfile), ml (ml.Dockerfile), react (react.Dockerfile), react-native dev (react-native.Dockerfile), nginx (nginx.Dockerfile).
- Nginx: `apps/nginx/nginx.conf` (server_name `mind-spark.ru`, proxy `/api -> mindspark-api:8000`, `/ml -> mindspark-ml:8001`, остальное → `mindspark-react:3000`).
- Запуск всего стека:  
  ```bash
  cd apps/docker
  docker compose up --build
  ```
- Прод: Kubernetes/Helm с Deployments и HPA для API/ML, initContainer для прогрева модели, ingress/Nginx с TLS/HTTP3/CDN/EdgeCache и WAF.

### Мини-шпаргалка Docker (Dockerfile уже есть)
```bash
# API
cd apps/api.mind-spark.ru
docker build -t mindspark/api .
docker run -p 8000:8000 --env-file .env mindspark/api

# ML
cd apps/ml.mind-spark.ru
docker build -t mindspark/ml .
docker run -p 8001:8001 --env-file .env -v $(pwd)/models:/app/models mindspark/ml

# Web (статичная сборка -> nginx)
cd apps/react.mind-spark.ru
docker build -t mindspark/web .
docker run -p 3000:80 mindspark/web

# Nginx edge (reverse-proxy)
cd apps/nginx
docker run -p 80:80 -p 443:443 -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine
```

## Локальный запуск
### Предварительные требования
- Node.js 20+ и npm
- Python 3.11 (ML) / 3.10+ (API минимум)
- Poetry, Redis, PostgreSQL, Expo CLI / Expo Go или Dev Client

### Web (`apps/react.mind-spark.ru`)
```bash
cd apps/react.mind-spark.ru
npm install
npm start  # CRA на 3000
```
Конфиг в `src/config.js`: прод `mind-spark.ru`, dev — `hostname:8000/3000`. При необходимости поправьте.

### Mobile (`apps/react-native.mind-spark.ru`)
```bash
cd apps/react-native.mind-spark.ru
npm install
npx expo start        # или npx expo start --dev-client
```
- Dev URL из `config.js` (`Constants.expoConfig.hostUri`, порты 8000/3000).  
- Диплинк `mindspark://auth`; токен/кеш сообщений — `AsyncStorage`.

### API (`apps/api.mind-spark.ru`)
```bash
cd apps/api.mind-spark.ru
poetry install
# создайте .env по списку ниже
poetry run uvicorn app.main:app --reload --port 8000
```
Нужны PostgreSQL и Redis.

### ML (`apps/ml.mind-spark.ru`)
```bash
cd apps/ml.mind-spark.ru
poetry install
# скачайте GGUF модель в MODELS_PATH/MODEL_NAME.gguf
poetry run uvicorn app.main:app --reload --port 8001
```
Эндпоинт: `POST /v1/ml/predict?text=...` → `text/event-stream`.

## Переменные окружения
### API (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/mindspark
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
EMAIL_ADDRESS=no-reply@mindspark.ru
EMAIL_PASSWORD=...
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=...
REDIS_DB=0
VERIFICATION_CODE_TTL=600
OAUTH_GOOGLE_CLIENT_SECRET=...
OAUTH_GOOGLE_CLIENT_ID=...
GOOGLE_TOKEN_URL=https://oauth2.googleapis.com/token
JWT_SECRET_KEY=super-secret
```

### ML (.env)
```
MODEL_NAME=llama-3-8b-instruct-q4
MODELS_PATH=models
SKIP_MODEL_LOAD=false   # true — пропустить загрузку при старте
```

## API срез (основные маршруты)
- `POST /v1/users/` (и CRUD), `GET /v1/users/email/{email}` — поиск по e-mail.
- `POST /v1/sessions/` — логин; `POST /v1/sessions/google` — логин по Google e-mail; `GET /v1/sessions/` — профиль по токену.
- `POST /v1/verification/send_verification_code`, `GET /v1/verification/verification` — отправка/проверка кода.
- `POST /v1/google/url`, `POST /v1/google/callback` — получение ссылки и обработка OAuth.
- `POST /v1/chats/`, `GET /v1/chats/` — заготовки под историю чатов.

## Медиа-плейсхолдеры
<img src="docs/images/main_screen.png" alt="Лого MindSpark" width="300"/>
<img src="docs/images/dashboard.png" alt="Дашборд" width="300"/>
<img src="docs/images/video.gif" alt="GIF чата" width="300"/>
<img src="docs/images/video2.gif" alt="GIF приложения" width="300"/>

## Roadmap (набросок)
- Интеграция браслета (биометрия stress/HRV/SpO2) в API/дашборды.
- Синхронизация истории чатов с ML и персонализация на данных пользователя.
- Экран «Кабинет статистики» с корреляциями сна/стресса/продуктивности.
- Платёжная модель: подписка/premium.
- Контейнерные образы + Compose/Helm в репозитории; CI/CD пайплайн на staging/prod.
- Edge-слой: Nginx/ingress с mTLS, HTTP/3, CDN, rate-limit, WAF; сервис-меш и трассировка (OpenTelemetry, Tempo/Jaeger) для прод-наблюдаемости; gRPC/GraphQL шлюз для будущих микросервисов и нагрузочного автоскейла.

---
Coaching-first, privacy-first.
