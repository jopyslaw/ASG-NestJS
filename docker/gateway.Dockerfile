FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=api-gateway
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/package.json .
    
CMD ["node", "dist/main.js"]
    