FROM node:18.15-alpine

WORKDIR /app

COPY package*.json ./

COPY ./src/prisma ./src/prisma

RUN npm install

COPY . .

COPY ./dist ./dist

