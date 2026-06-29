FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
RUN npm run build
CMD ["node", "dist/main.js"]
