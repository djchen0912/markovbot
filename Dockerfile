# Use an official Node.js runtime as the base image
FROM node:20.6.1-alpine

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Command to run the application
CMD [ "node", "./src/index.js" ]