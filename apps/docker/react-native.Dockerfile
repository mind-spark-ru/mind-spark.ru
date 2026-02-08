FROM node:22-alpine

WORKDIR /app

COPY react-native.mind-spark.ru/package*.json ./

RUN npm install

COPY react-native.mind-spark.ru/ .

EXPOSE 19001 19002 8081

CMD ["npx", "expo", "start", "--tunnel"]