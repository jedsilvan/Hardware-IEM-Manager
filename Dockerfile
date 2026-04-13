# Use an official Node.js image as the base
FROM node:20-bullseye

# Install Postgres
RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for Postgres
ENV POSTGRES_USER=dev_user \
    POSTGRES_PASSWORD=dev_password \
    POSTGRES_DB=gear_tracker

# Create working directories
WORKDIR /app

# Copy backend and frontend code
COPY gear-tracker-backend ./gear-tracker-backend
COPY gear-tracker-frontend ./gear-tracker-frontend

# Install backend dependencies
WORKDIR /app/gear-tracker-backend
RUN npm install

# Install frontend dependencies
WORKDIR /app/gear-tracker-frontend
RUN npm install

# Copy start script
WORKDIR /app
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose ports: 5432 (Postgres), 3001 (backend), 3000 (frontend)
EXPOSE 5432 3001 3000

# Start all services
CMD ["./start.sh"]
