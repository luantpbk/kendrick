#!/bin/bash
echo "=== Bắt đầu quá trình Deploy ==="

echo "=> Kéo mã nguồn mới từ Git..."
git pull origin main

echo "=> Cài đặt và Build Backend (core, api, ws)..."
cd be.kendrickheller.com
npm install --legacy-peer-deps

cd packages/core
npx prisma generate
npx tsc

cd ../../apps/api
npx tsc
pm2 restart backend-api || pm2 start dist/src/server.js --name "backend-api"

cd ../ws
npx tsc
pm2 restart backend-ws || pm2 start dist/server.js --name "backend-ws"

cd ../../../

echo "=> Cài đặt và build Frontend Web..."
cd kendrickheller.com
npm install --legacy-peer-deps
npm run build
pm2 restart frontend-web || pm2 start serve --name "frontend-web" -- -s build -l 3002
cd ..

echo "=> Cài đặt và build Frontend Admin..."
cd admin.kenrickheller.com
npm install --legacy-peer-deps
npm run build
pm2 restart frontend-admin || pm2 start serve --name "frontend-admin" -- -s build -l 3004
cd ..

echo "=== Triển khai hoàn tất! ==="
