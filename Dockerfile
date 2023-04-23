# build stage
FROM node:18-alpine as base

LABEL svc.maintainer=alex.li@oyiyio.com \
      svc.name=yi-svc-storage \
      svc.version=0.0.14

FROM base as build-stage

# Run as an unprivileged user.
RUN addgroup -S oyiyio && adduser -S -G oyiyio oyiyio
RUN mkdir /app && chown oyiyio /app
USER oyiyio

WORKDIR /app
COPY --chown=oyiyio:oyiyio package.json yarn.lock /app/
RUN yarn install
COPY --chown=oyiyio:oyiyio . .
ENV NODE_ENV=production
RUN yarn build

# production stage
FROM base as production-stage
RUN mkdir /app
RUN mkdir -p /app/bucket

WORKDIR /app
COPY --from=build-stage /app/package.json /app/yarn.lock ./
COPY --from=build-stage /app/config ./config
COPY --from=build-stage /app/dist ./dist
ENV NODE_ENV=production
RUN yarn install --production

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

EXPOSE 3000