FROM node:10.13.0-alpine

ENV APP_PATH /opt/github-metrics

RUN apk add --no-cache bash make gcc g++ python && \
    rm -rf /var/cache/apk/*

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY . $APP_PATH
RUN rm -rf node_modules/
RUN npm install
