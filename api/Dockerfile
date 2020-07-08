# Compile the API app
FROM node:10.15-alpine as compile-api

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --network-timeout 100000

COPY tsconfig.json .
COPY src src/

RUN yarn build:dist

RUN npm prune --production

# Run the compiled API app with only production dependencies
FROM node:10.15-alpine

COPY --from=compile-api /app/dist ./dist
COPY --from=compile-api /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NODE_PATH=./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]