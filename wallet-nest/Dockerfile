# Build stage for frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build stage for backend
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
# Only install production dependencies for the backend
RUN npm install --omit=dev
COPY server ./server

# Final production stage
FROM node:22-alpine
WORKDIR /app
# Copy the built frontend
COPY --from=frontend-builder /app/dist ./dist
# Copy the backend code and dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server ./server
COPY package.json ./

# Expose the port the app runs on. Google Cloud Run dynamically assigns a PORT env var.
ENV PORT=8080
EXPOSE 8080

# Environment variables needed by the backend
ENV NODE_ENV=production

# Start the server
CMD ["npm", "run", "server"]
