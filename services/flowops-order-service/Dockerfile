FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application source
COPY src ./src

EXPOSE 5001

# Use the existing start script
CMD ["npm", "run", "start"]
