# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY scripts ./scripts
RUN npm ci

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

RUN groupadd --system --gid 1001 strapi \
  && useradd --system --uid 1001 --gid 1001 --home-dir /home/strapi --create-home strapi

COPY --from=builder /app ./

RUN mkdir -p /app/public/uploads \
  && chown -R strapi:strapi /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
