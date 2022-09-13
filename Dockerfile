FROM node:16-alpine

LABEL web.maintainer=alex.li@oyiyio.com \
      web.name=yi-svc-storage \
      web.version=0.0.1

EXPOSE 3000

# Run as an unprivileged user.
RUN addgroup -S oyiyio && adduser -S -G oyiyio oyiyio
RUN mkdir /app && chown oyiyio /app
RUN mkdir -p /app/bucket && chown oyiyio /app/bucket
USER oyiyio

WORKDIR /app

COPY --chown=oyiyio:oyiyio package.json /app/
COPY --chown=oyiyio:oyiyio yarn.lock /app/

RUN yarn install

COPY --chown=oyiyio:oyiyio . .

ENV NODE_ENV=production

RUN yarn build

CMD [ "yarn", "start" ]
