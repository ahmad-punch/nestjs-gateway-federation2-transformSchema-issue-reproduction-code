# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install bash and netcat
# RUN apk add --no-cache bash

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

RUN npm run build
# Copy and convert wait-for-it.sh
# COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# # Copy the start script
# COPY start.sh /usr/src/app/start.sh

# # Convert to Unix line endings and make it executable
# RUN sed -i 's/\r$//' /usr/src/app/wait-for-it.sh && \
#     chmod +x /usr/src/app/wait-for-it.sh && \
#     chmod +x /usr/src/app/start.sh

# Build the NestJS application


# Expose the port
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start:prod"]
