# Base image
FROM node:18

# Working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the port (same as in server.js)
EXPOSE 4000

# Start only the backend server (no PM2 or background index.js)
CMD ["node", "server.js"]
