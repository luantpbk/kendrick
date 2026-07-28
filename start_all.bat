@echo off
echo ==================================================
echo KHỞI ĐỘNG HỆ THỐNG KENDRICKHELLER
echo ==================================================

echo [1/4] Đang khởi động Backend API (Port 3000)...
start "Backend API" cmd /k "cd be.kendrickheller.com\apps\api && npm run dev"
timeout /t 3 /nobreak > NUL

echo [2/4] Đang khởi động WebSocket Server (Port 3003)...
start "WebSocket Server" cmd /k "cd be.kendrickheller.com\apps\ws && npm run dev"
timeout /t 3 /nobreak > NUL

echo [3/4] Đang khởi động Admin Web (Port 3001)...
start "Admin Web" cmd /k "cd admin.kenrickheller.com && set PORT=3001 && set REACT_APP_API_URL=http://localhost:3000/api && set REACT_APP_SERVER_URL=http://localhost:3000 && npm start"
timeout /t 3 /nobreak > NUL

echo [4/4] Đang khởi động Client Web (Port 3002)...
start "Client Web" cmd /k "cd kendrickheller.com && set PORT=3002 && set REACT_APP_API_URL=http://localhost:3000/api && set REACT_APP_SERVER_URL=http://localhost:3000 && npm start"

echo.
echo ==================================================
echo Hoàn tất! 4 cửa sổ Terminal đã được mở.
echo Hãy giữ các cửa sổ đó mở trong lúc test nhé!
echo ==================================================
