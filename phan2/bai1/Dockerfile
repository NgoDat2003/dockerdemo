# Sử dụng node:18 làm base image
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào trong container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD ["node", "app.js"]
