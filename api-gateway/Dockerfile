FROM node:22.13-alpine

WORKDIR /app

RUN apk add curl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]