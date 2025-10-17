@echo off
REM Batch script to enable mobile access to AI Tools Manager
REM Run this script as Administrator

echo =====================================
echo AI Tools Manager - Mobile Access Setup
echo =====================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Step 1: Getting your computer's IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo Your IP Address: %IP%
echo.

echo Step 2: Configuring Windows Firewall...
netsh advfirewall firewall delete rule name="AI Tools Manager - Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="AI Tools Manager - Backend" >nul 2>&1

netsh advfirewall firewall add rule name="AI Tools Manager - Frontend" dir=in action=allow protocol=TCP localport=8200
if %errorLevel% equ 0 (
    echo   + Frontend port 8200 opened
) else (
    echo   X Failed to open port 8200
    pause
    exit /b 1
)

netsh advfirewall firewall add rule name="AI Tools Manager - Backend" dir=in action=allow protocol=TCP localport=8201
if %errorLevel% equ 0 (
    echo   + Backend port 8201 opened
) else (
    echo   X Failed to open port 8201
    pause
    exit /b 1
)

echo.
echo Step 3: Checking Docker...
docker info >nul 2>&1
if %errorLevel% neq 0 (
    echo   X Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo   + Docker is running
echo.

echo Step 4: Restarting Docker containers...
docker compose down
docker compose up -d

echo.
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo Access your app from mobile device:
echo   http://%IP%:8200
echo.
echo Login credentials:
echo   Email: test@example.com
echo   Password: password
echo.
echo Make sure your mobile device is on the same Wi-Fi network!
echo.
echo For detailed instructions, see MOBILE_ACCESS.md
echo.
pause
