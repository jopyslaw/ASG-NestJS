FROM node:20-alpine AS builder
WORKDIR /app
    
COPY package*.json ./
COPY apps/users-service/package*.json ./apps/users-service/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=users-service
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/users-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/users-service/package.json .
    
CMD ["node", "dist/main.js"]
    