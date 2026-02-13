FROM node:14 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN npm install --only=production
CMD ["node", "dist/index.js"]

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:3000/health || exit 1