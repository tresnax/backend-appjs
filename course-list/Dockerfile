FROM node:21.5-alpine

COPY . /app

WORKDIR /app

RUN npm install express jsonwebtoken body-parser pg dotenv

ENTRYPOINT [ "node", "index.js" ]

EXPOSE 3000