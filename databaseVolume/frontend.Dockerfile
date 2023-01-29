FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY frontend/package.json ./frontend/package.json

RUN npm ci

COPY . .

RUN npm run build-front

EXPOSE 5173

CMD ["node","./dist"]