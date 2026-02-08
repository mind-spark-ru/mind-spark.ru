FROM node:18-alpine AS builder

WORKDIR /app

COPY react.mind-spark.ru/package*.json ./

RUN npm install

COPY react.mind-spark.ru/ .

EXPOSE 3000

CMD ["npm", "start"]