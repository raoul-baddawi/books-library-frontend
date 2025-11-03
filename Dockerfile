# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy everything
COPY . .

# Define build arguments for environment variables
ARG VITE_BASE_API_URL

# Set them as environment variables during build
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

# Debug: Check environment variables
RUN echo "=== Environment variables during build ===" && \
    printenv | grep VITE_ || echo "No VITE_ variables found"

# Build the app
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]