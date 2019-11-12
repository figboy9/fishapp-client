FROM node:12.13.0-alpine as builder
RUN apk update
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM node:12.13.0-alpine
RUN apk update
WORKDIR /app
ENV HOST="0.0.0.0"
COPY package.json .
COPY nuxt.config.js .
COPY yarn.lock .

COPY --from=builder ./app/node_modules node_modules
COPY --from=builder ./app/.nuxt .nuxt
COPY --from=builder ./app/static static

CMD [ "yarn", "start" ]