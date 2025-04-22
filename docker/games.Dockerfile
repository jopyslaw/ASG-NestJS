FROM node:20-alpine AS builder
WORKDIR /app
    
COPY package*.json ./
COPY apps/games-service/package*.json ./apps/games-service/
    
RUN npm ci
    
COPY . .
    
RUN npx turbo run build --filter=games-service
    
FROM node:20-alpine
WORKDIR /app
    
COPY --from=builder /app/apps/games-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/games-service/package.json .
    
CMD ["node", "dist/main.js"]
    