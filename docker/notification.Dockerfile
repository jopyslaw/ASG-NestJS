FROM node:20-alpine AS builder
WORKDIR /app
    
COPY package*.json ./
COPY apps/notifications-service/package*.json ./apps/notifications-service/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=notifications-service
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/notifications-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/notifications-service/package.json .
    
CMD ["node", "dist/main.js"]
    