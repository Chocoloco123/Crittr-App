# Build stage: install deps and build Next.js (no DB connection)
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# Generate Prisma client (no DB needed)
COPY prisma ./prisma
RUN npx prisma generate

# Build the app
COPY . .
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# Production stage: run the app
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
