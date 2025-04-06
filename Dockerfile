FROM alpine:latest

RUN apk update
RUN apk add nodejs-current npm

WORKDIR /memobrain

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm i

COPY . .

ENTRYPOINT [ "node", "" ]