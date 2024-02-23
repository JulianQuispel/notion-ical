FROM node:20-alpine as base
COPY . /app
WORKDIR /app

FROM base as prod-deps
RUN npm ci --omit=dev --ignore-scripts

FROM base AS build
RUN npm ci --ignore-scripts

RUN npm run compile

FROM node:20-alpine as production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/build /app/build

WORKDIR /app

EXPOSE 3000

CMD [ "build/index.js" ]
