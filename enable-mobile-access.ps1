# PowerShell script to enable mobile access to AI Tools Manager
# Run this script as Administrator

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "AI Tools Manager - Mobile Access Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 1: Getting your computer's IP address..." -ForegroundColor Green
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1 -ExpandProperty Name)).IPAddress
Write-Host "Your IP Address: $ipAddress" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 2: Configuring Windows Firewall..." -ForegroundColor Green

# Remove existing rules if they exist
Remove-NetFirewallRule -DisplayName "AI Tools Manager - Frontend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "AI Tools Manager - Backend" -ErrorAction SilentlyContinue

# Create new firewall rules
try {
    New-NetFirewallRule -DisplayName "AI Tools Manager - Frontend" `
                        -Direction Inbound `
                        -LocalPort 8200 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any | Out-Null
    Write-Host "  ✓ Frontend port 8200 opened" -ForegroundColor Green

    New-NetFirewallRule -DisplayName "AI Tools Manager - Backend" `
                        -Direction Inbound `
                        -LocalPort 8201 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any | Out-Null
    Write-Host "  ✓ Backend port 8201 opened" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to create firewall rules: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Checking Docker..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Docker is running" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Restarting Docker containers..." -ForegroundColor Green
docker compose down
docker compose up -d

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your app from mobile device:" -ForegroundColor Yellow
Write-Host "  http://${ipAddress}:8200" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Yellow
Write-Host "  Email: test@example.com" -ForegroundColor White
Write-Host "  Password: password" -ForegroundColor White
Write-Host ""
Write-Host "Make sure your mobile device is on the same Wi-Fi network!" -ForegroundColor Yellow
Write-Host ""
Write-Host "For detailed instructions, see MOBILE_ACCESS.md" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
