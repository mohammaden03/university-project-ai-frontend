# Multi-stage Dockerfile for Manuscript AI Frontend
# Stage 1: Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first for efficient layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx stage
FROM nginx:alpine

# Copy built static files to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
