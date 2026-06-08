# Dockerfile for Next.js
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

# Copy from builder
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma

# Ensure database directory exists
RUN mkdir -p /app/prisma

EXPOSE 3000
CMD ["npm", "start"]
