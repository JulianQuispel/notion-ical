FROM node:16-alpine as build-target

EXPOSE 3000

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build
RUN npm prune --production

CMD ["node", "dist/index.js"]
