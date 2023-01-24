FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY backend/package.json ./backend/package.json

RUN npm ci

COPY . .

RUN npm run build-back

EXPOSE 3000

CMD ["node","dist/main.js"]