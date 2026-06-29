FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD ["npx", "ts-node-dev", "--respawn", "src/main.ts"]
