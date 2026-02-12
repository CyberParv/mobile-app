FROM node:16-alpine as build
WORKDIR /app
COPY package.json .
COPY prisma ./prisma/
RUN npm install -g npm@latest
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:3000 || exit 1
