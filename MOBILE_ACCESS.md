# Mobile Access Guide

This guide will help you access your AI Tools Manager application from your mobile device.

## Prerequisites

- Your computer and mobile device must be on the **same Wi-Fi network**
- Docker containers must be running on your computer
- Windows Firewall must allow incoming connections on ports 8200 and 8201

## Step 1: Find Your Computer's IP Address

Your current computer IP address is: **192.168.1.102**

To verify or find it again:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually Ethernet or Wi-Fi)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address under your active network interface

## Step 2: Configure Windows Firewall

You need to allow incoming connections on ports 8200 (frontend) and 8201 (backend).

### Option A: Using Windows Defender Firewall GUI

1. Open **Windows Defender Firewall with Advanced Security**
2. Click on **Inbound Rules** in the left panel
3. Click **New Rule** in the right panel
4. Select **Port** and click Next
5. Select **TCP** and enter **8200, 8201** in "Specific local ports"
6. Select **Allow the connection** and click Next
7. Check all three profiles (Domain, Private, Public) and click Next
8. Name it "AI Tools Manager" and click Finish

### Option B: Using PowerShell (Run as Administrator)

```powershell
New-NetFirewallRule -DisplayName "AI Tools Manager - Frontend" -Direction Inbound -LocalPort 8200 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "AI Tools Manager - Backend" -Direction Inbound -LocalPort 8201 -Protocol TCP -Action Allow
```

### Option C: Using Command Prompt (Run as Administrator)

```cmd
netsh advfirewall firewall add rule name="AI Tools Manager - Frontend" dir=in action=allow protocol=TCP localport=8200
netsh advfirewall firewall add rule name="AI Tools Manager - Backend" dir=in action=allow protocol=TCP localport=8201
```

## Step 3: Restart Docker Containers

The Docker configuration has been updated to listen on all network interfaces. Restart the containers:

```bash
docker compose down
docker compose up -d
```

Wait for the containers to fully start (about 30-60 seconds).

## Step 4: Access from Mobile Device

Open your mobile browser and navigate to:

```
http://192.168.1.102:8200
```

Replace `192.168.1.102` with your actual IP address if different.

## Step 5: Login

Use one of the test accounts:

- **Email:** `test@example.com`
- **Password:** `password`

Or:
- **Email:** `john.doe@example.com`
- **Password:** `password`

## Troubleshooting

### Cannot Connect to Server

**Check Computer IP Address:**
- Ensure you're using the correct IP address
- IP addresses can change if your computer reconnects to Wi-Fi

**Verify Same Network:**
- Both devices must be on the same Wi-Fi network
- Some networks isolate devices from each other (common in public Wi-Fi)
- Try using a personal hotspot as an alternative

**Check Docker Status:**
```bash
docker compose ps
```
All containers should show "Up" status

**Test Backend API:**
From your mobile browser, visit:
```
http://192.168.1.102:8201/api/health
```
You should see a response (even if it's an error, it means the connection works)

**Windows Firewall:**
- Make sure firewall rules were created successfully
- Temporarily disable Windows Firewall to test (remember to re-enable it!)

**Check Docker Port Bindings:**
```bash
docker compose ps
```
Should show ports bound to `0.0.0.0:8200` and `0.0.0.0:8201`

### API Calls Failing

The app automatically detects when you're accessing via IP address and adjusts API calls accordingly. If you see network errors:

1. Check browser console (Developer Tools on mobile)
2. Verify the API URL being used matches your computer's IP
3. Ensure backend container is running: `docker compose logs backend`

### Slow Performance

- Mobile devices may experience slightly slower load times
- Ensure good Wi-Fi signal strength
- Clear mobile browser cache if images/styles don't load properly

### IP Address Changes

If your computer's IP address changes:

1. Find the new IP address: `ipconfig`
2. Update this guide with the new IP
3. No code changes needed - the app auto-detects the IP
4. Simply use the new IP address in your mobile browser

## Features Optimized for Mobile

✅ **Responsive Design** - All pages adapt to mobile screen sizes
✅ **Touch-Friendly** - Buttons and interactive elements sized for touch
✅ **Mobile Navigation** - Hamburger menu for easy navigation
✅ **Optimized Forms** - Mobile-friendly input fields and checkboxes
✅ **Viewport Configuration** - Proper zooming and scaling

## Mobile-Specific Tips

- **Add to Home Screen**: On iOS, tap Share > Add to Home Screen for app-like experience
- **Landscape Mode**: Works great in both portrait and landscape orientations
- **Pull to Refresh**: Refresh the page by pulling down (browser feature)
- **Bookmarks**: Bookmark the IP address for quick access

## Network Security Note

This setup is intended for development and local network access only. Do not expose these ports to the public internet without proper security measures:

- Use HTTPS with valid certificates
- Implement rate limiting
- Add additional authentication layers
- Use a VPN for remote access instead of port forwarding

## Alternative: Using Computer Name

On some networks, you can use your computer's hostname instead of IP:

```
http://YOUR-COMPUTER-NAME:8200
```

To find your computer name:
- Windows: `hostname` in Command Prompt
- Look in System Settings > About

This may not work on all networks depending on DNS configuration.

---

**Need Help?** Check the Docker logs:
```bash
# All logs
docker compose logs -f

# Frontend only
docker compose logs -f frontend

# Backend only
docker compose logs -f backend
```
