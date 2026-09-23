FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for better-sqlite3 native compilation on alpine
RUN apk add --no-cache python3 make g++

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Ensure data and uploads directories exist
RUN mkdir -p data uploads

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["node", "server.js"]
