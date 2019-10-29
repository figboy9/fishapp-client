FROM node:12.13.0-alpine as builder
RUN apk update
WORKDIR /app
COPY . .
RUN yarn
# ビルド前に環境変数を注入
ARG DOMAIN_NAME
ENV DOMAIN_NAME $DOMAIN_NAME
ARG EXP_SEC
ENV EXP_SEC $EXP_SEC
ARG RT_EXP_SEC
ENV RT_EXP_SEC $RT_EXP_SEC

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