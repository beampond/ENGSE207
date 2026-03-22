FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p database
EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3003/health || exit 1
CMD ["node", "server.js"]
