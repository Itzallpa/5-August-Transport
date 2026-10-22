@echo off
chcp 65001 >nul
title 5 August Transport - VPS & Dev Manager
color 0B
cd /d "%~dp0"

echo =====================================================================
echo    บริษัท 5 สิงหา ทรานสปอร์ต จำกัด (5 August Transport Co., Ltd.)
echo    Hostatom Cloud VPS & Local Development Launcher
echo =====================================================================
echo.
echo  [1] SSH Connect to Hostatom VPS (14.207.143.114)
echo  [2] Start Local Next.js Development Server (Port 3000)
echo  [3] Exit
echo.
set /p choice="เลือกการทำงาน (1-3) [ค่าเริ่มต้น 1]: "
if "%choice%"=="" set choice=1
if "%choice%"=="1" (
    echo กำลังเชื่อมต่อไปยัง Hostatom VPS (14.207.143.114)...
    ssh root@14.207.143.114
    goto end
)
if "%choice%"=="2" (
    echo กำลังเริ่มต้น Next.js Dev Server...
    npm run dev
    goto end
)
:end
pause