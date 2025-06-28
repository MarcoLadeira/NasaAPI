# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for both frontend and backend
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Install frontend dependencies and build
RUN cd frontend && npm ci && npm run build

# Copy the entire project
COPY . .

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