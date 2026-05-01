# Build stage for frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Accept build-time env vars so Vite can bake them into the bundle
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL=/api
ARG VITE_FINANCE_CHAT_PROXY_URL=/api/finance-chat

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FINANCE_CHAT_PROXY_URL=$VITE_FINANCE_CHAT_PROXY_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build stage for backend (production deps only)
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server ./server

# Final production image
FROM node:22-alpine
WORKDIR /app

# Copy the built frontend
COPY --from=frontend-builder /app/dist ./dist

# Copy the backend code and production dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server ./server
COPY package.json ./

# Google Cloud Run dynamically assigns PORT at runtime
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "run", "server"]
