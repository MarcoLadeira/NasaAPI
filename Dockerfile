# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the entire project first
COPY . .

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Install frontend dependencies and build
RUN cd frontend && npm ci && npm run build

# Build backend TypeScript
RUN cd backend && npm run build

# Create a directory for the frontend build in the backend
RUN mkdir -p backend/public && cp -r frontend/build/* backend/public/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the backend server
CMD ["node", "backend/dist/index.js"] 