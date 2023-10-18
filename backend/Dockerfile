# Dockerfile for production
# Referred to https://www.codemochi.com/blog/2022-01-01-dockerizing-nextjs-with-prisma-for-production

FROM node:16-buster-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y
WORKDIR /app

COPY package.json yarn.lock start.sh ./


FROM base as dev
RUN yarn install

FROM base as prod
RUN export NODE_ENV=production
RUN yarn install --production

COPY prisma prisma
RUN yarn run prisma:generate


FROM dev as build
COPY . .
RUN yarn run prisma:generate
RUN yarn build


FROM build as dev-runner
CMD ["yarn", "dev"]

FROM base as runner

COPY --from=prod /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma

EXPOSE 3000
RUN chmod +x ./start.sh
CMD ["./start.sh"]
