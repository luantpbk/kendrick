#!/bin/bash
echo "=== Bắt đầu quá trình Deploy ==="

# 1. Kéo mã nguồn mới nhất
echo "=> Kéo mã nguồn mới từ Git..."
git pull origin main

# 2. Triển khai Backend
echo "=> Cài đặt và build Backend..."
cd be.kendrickheller.com
npm install
npm run build
pm2 restart backend-api || pm2 start dist/server.js --name "backend-api"
cd ..

# 3. Triển khai Web (User)
echo "=> Cài đặt và build Frontend Web..."
cd kendrickheller.com
npm install
npm run build
# PM2 cho frontend nếu cần, hoặc Nginx serve thư mục build
cd ..

# 4. Triển khai Admin
echo "=> Cài đặt và build Frontend Admin..."
cd admin.kenrickheller.com
npm install
npm run build
cd ..

echo "=== Triển khai hoàn tất! ==="
