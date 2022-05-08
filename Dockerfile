FROM node:14-alpine

LABEL web.maintainer=alex.li@oyiyio.com \
      web.name=yi-svc-storage \
      web.version=0.0.1

ENV NODE_ENV=production

EXPOSE 3000

# Run as an unprivileged user.
RUN addgroup -S oyiyio && adduser -S -G oyiyio oyiyio
RUN mkdir /app && chown oyiyio /app
USER oyiyio

WORKDIR /app

COPY --chown=oyiyio:oyiyio package.json /app/
COPY --chown=oyiyio:oyiyio yarn.lock /app/

RUN yarn add @nestjs/cli -g
RUN yarn install

COPY --chown=oyiyio:oyiyio . .

RUN yarn build

CMD [ "yarn", "start" ]
