FROM oven/bun:1.4.2 AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends zip && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_OKNEF_APP_ORIGIN
ENV NEXT_PUBLIC_OKNEF_APP_ORIGIN=$NEXT_PUBLIC_OKNEF_APP_ORIGIN NEXT_TELEMETRY_DISABLED=1
RUN bun run typecheck && bun run test && bun audit --audit-level=high && bun run build

FROM oven/bun:1.4.2 AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=bun:bun /app/.next/standalone ./
COPY --from=build --chown=bun:bun /app/.next/static ./.next/static
COPY --from=build --chown=bun:bun /app/public ./public
USER bun
CMD ["bun", "server.js"]
