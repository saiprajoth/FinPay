FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS pruner
COPY . .
RUN npx turbo prune backend --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=pruner /app/out/full/ .
RUN npx turbo run build --filter=backend

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app .

WORKDIR /app/apps/backend
EXPOSE 3000

CMD ["node", "dist/index.js"]