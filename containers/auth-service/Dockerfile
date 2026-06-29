FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g ts-node-dev
EXPOSE 3005
CMD ["ts-node-dev", "--respawn", "src/main.ts"]
