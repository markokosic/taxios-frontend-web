# ==========================================
# Stage 1: Build the React application
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies using clean install for deterministic builds
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve the application with Nginx
# ==========================================
FROM nginx:stable-alpine

# Copy the built assets from the previous stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration for proper routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
