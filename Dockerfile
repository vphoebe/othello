FROM node:18-alpine as builder
WORKDIR /builder
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./
RUN npm install --location=global pnpm
RUN pnpm install --frozen-lockfile true
COPY ./src ./src
RUN pnpm build
RUN pnpm prune --prod

FROM node:18-alpine as prod
ENV PM2_PUBLIC_KEY="" \
  PM2_SECRET_KEY="" \
  TOKEN="" \
  CLIENT_ID="" \ 
  GUILD_ID="" \
  NODE_ENV="production"
WORKDIR /usr/othello
RUN npm install --location=global pm2
COPY ecosystem.config.cjs ./
COPY package.json ./
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/build ./build
CMD ["pm2-runtime", "ecosystem.config.cjs"]
