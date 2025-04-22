FROM node:20-alpine AS builder
WORKDIR /app
    
COPY package*.json ./
COPY apps/auth-service/package*.json ./apps/auth-service/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=auth-service
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth-service/package.json .
    
CMD ["node", "dist/main.js"]    