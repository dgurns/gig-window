# Build the web app
FROM node:10.15-alpine as build-web

ENV NODE_ENV=production

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --network-timeout 100000

COPY tsconfig.json .
COPY src src/
COPY public public/

RUN yarn build

# Serve the built app via nginx
FROM beamaustralia/react-env:latest

WORKDIR /var/www

COPY --from=build-web /app/build /var/www

COPY .env* /var/www/