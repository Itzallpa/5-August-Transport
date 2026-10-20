@echo off
chcp 65001 >nul
title 5 August Transport - Live Host and Serveo Tunnel
color 0A
cd /d "%~dp0"

echo =====================================================================
echo    บริษัท 5 สิงหา ทรานสปอร์ต จำกัด (5 August Transport Co., Ltd.)
echo    One-Click Host and Serveo Tunnel Launcher
echo =====================================================================
echo.

:: -------------------------------------------------------------
:: Step 1: ตรวจสอบและเปิด App (app.py) บน Port 5000
:: -------------------------------------------------------------
echo [1/2] ตรวจสอบสถานะ Web App Server [Port 5000]...
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo       [OK] Web App Server กำลังเปิดทำงานอยู่แล้วที่ Port 5000
) else (
    echo       [+] กำลังเปิด Web App Server [app.py] บน Port 5000...
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        start "5 August App Server Port 5000" py app.py
    ) else (
        start "5 August App Server Port 5000" python app.py
    )
    echo       รอระบบ Web App เริ่มต้นสักครู่...
    ping 127.0.0.1 -n 3 >nul
)

echo.
:: -------------------------------------------------------------
:: Step 2: ตรวจสอบไฟล์ SSH Key
:: -------------------------------------------------------------
set "KEY_PATH=%USERPROFILE%\.ssh\id_ed25519"
if not exist "%KEY_PATH%" (
    echo [!] คำเตือน: ไม่พบไฟล์ SSH Key ที่: %KEY_PATH%
    echo     จะลองใช้ SSH ค่าเริ่มต้น...
    set "SSH_KEY_OPT="
) else (
    echo [OK] ตรวจพบ SSH Key: %KEY_PATH%
    set "SSH_KEY_OPT=-i %KEY_PATH%"
)

echo.
echo =====================================================================
echo    ข้อมูลการเข้าถึงเว็บไซต์ (Access URLs)
echo =====================================================================
echo  * Local URL  : http://localhost:5000
echo  * Public URL : https://5augtransport.serveousercontent.com
echo  * Tunnel     : 5augtransport.serveo.net
echo =====================================================================
echo.

:: -------------------------------------------------------------
:: Step 3: เริ่มต้น Serveo Tunnel พร้อมระบบ Reconnect
:: -------------------------------------------------------------
:tunnel_loop
echo [2/2] เริ่มต้น Serveo SSH Tunnel...
echo กำลังเชื่อมต่อไปยัง serveo.net [5augtransport:80:127.0.0.1:5000]...
echo กด Ctrl+C หากต้องการหยุดการ Host
echo.

ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 %SSH_KEY_OPT% -R 5augtransport:80:127.0.0.1:5000 serveo.net

echo.
echo [!] การเชื่อมต่อ Tunnel สิ้นสุดลงหรือหลุดการเชื่อมต่อ
echo.
set /p user_choice="ต้องการเชื่อมต่อใหม่ [Reconnect] หรือไม่? [Y/N] (ค่าเริ่มต้น Y): "
if /i "%user_choice%"=="n" goto end
if /i "%user_choice%"=="no" goto end
echo กำลังเชื่อมต่อใหม่ใน 3 วินาที...
ping 127.0.0.1 -n 4 >nul
goto tunnel_loop

:end
echo ขอบคุณที่ใช้งาน 5 August Transport Host Launcher
pause