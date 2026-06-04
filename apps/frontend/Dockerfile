FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS pruner
COPY . .
RUN npx turbo prune frontend --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=pruner /app/out/full/ .
RUN npx turbo run build --filter=frontend

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]