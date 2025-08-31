FROM node:20-alpine

# Set up working directory
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package files and change ownership
COPY package*.json ./
RUN chown node:node package*.json

# Switch to node user before install
USER node

# Install dependencies
RUN npm install

# Copy the rest of the app (with ownership)
COPY --chown=node:node . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
