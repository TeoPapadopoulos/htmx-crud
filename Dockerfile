FROM oven/bun:1.3

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY drizzle ./drizzle
COPY drizzle.config.ts tsconfig.json ./

ENV NODE_ENV=production
RUN bun run build:css

EXPOSE 3100

CMD ["sh", "-c", "bun run db:migrate && bun start"]