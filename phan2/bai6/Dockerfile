# Stage 1: Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Run stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]