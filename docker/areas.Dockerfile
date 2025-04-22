FROM node:20-alpine AS builder
WORKDIR /app
    
COPY package*.json ./
COPY apps/areas-service/package*.json ./apps/areas-service/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=areas-service
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/areas-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/areas-service/package.json .
    
CMD ["node", "dist/main.js"]
    