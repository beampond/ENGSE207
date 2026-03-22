# Week 6 — Dockerfile
# Tier 2: Web/API Server container

FROM node:20-alpine

# ตั้ง working directory
WORKDIR /app

# Copy package files ก่อน (cache layer)
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# สร้าง database directory
RUN mkdir -p database

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

# Start server
CMD ["node", "server.js"]
