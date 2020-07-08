# Build the web app
FROM node:10.15-alpine as build-web

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --network-timeout 100000

COPY tsconfig.json .
COPY src src/
COPY public public/

RUN yarn build

# Serve the built app via nginx
FROM nginx:alpine
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-web /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]