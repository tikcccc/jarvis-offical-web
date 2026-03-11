# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public/server URLs for client/server bundles.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
ARG STRAPI_URL=http://cms:1337
ARG NEXT_PUBLIC_MEDIA_URL=
ARG NEXT_PUBLIC_VIDEO_CDN_URL=
ARG NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL=

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV STRAPI_URL=$STRAPI_URL
ENV NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL
ENV NEXT_PUBLIC_VIDEO_CDN_URL=$NEXT_PUBLIC_VIDEO_CDN_URL
ENV NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL=$NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL

RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nextjs \
  && useradd --system --uid 1001 --gid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
