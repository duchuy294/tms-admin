FROM node:13-alpine as builder

WORKDIR /tmpbuilder
COPY . .

RUN apk add git ca-certificates --no-cache \
    && git config --global http.sslverify "false" \
    && npm install \
    && npm run build:$ENV \
    && rm -rf node_modules

FROM node:13-alpine

WORKDIR /app
COPY --from=builder /tmpbuilder/dist /app/dist
ADD server.js /app/server.js
RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add git --no-cache \
    && git config --global http.sslverify "false"
RUN yarn add express \
    && rm -rf /tmp/*

CMD ["node", "server.js"]
