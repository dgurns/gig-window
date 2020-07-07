# Build the web app
FROM node:alpine as build-web

ARG REACT_APP_GRAPHQL_HTTP_URL
ARG REACT_APP_GRAPHQL_WEBSOCKETS_URL
ARG REACT_APP_RTMP_URL
ARG REACT_APP_STRIPE_PUBLISHABLE_KEY
ARG REACT_APP_STRIPE_CONNECT_CLIENT_ID

RUN apk add yarn

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --frozen-lockfile --network-timeout 100000

COPY src src/
COPY public public/

RUN REACT_APP_GRAPHQL_HTTP_URL=$REACT_APP_GRAPHQL_HTTP_URL \
  REACT_APP_GRAPHQL_WEBSOCKETS_URL=$REACT_APP_GRAPHQL_WEBSOCKETS_URL \
  REACT_APP_RTMP_URL=$REACT_APP_RTMP_URL \
  REACT_APP_STRIPE_PUBLISHABLE_KEY=$REACT_APP_STRIPE_PUBLISHABLE_KEY \
  REACT_APP_STRIPE_CONNECT_CLIENT_ID=$REACT_APP_STRIPE_CONNECT_CLIENT_ID \
  yarn build

# Serve the built app via nginx
FROM nginx:alpine
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-web /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]