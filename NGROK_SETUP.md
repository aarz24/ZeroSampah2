# How to Use Ngrok for HTTPS Access

## Step 1: Download & Install Ngrok
1. Go to: https://ngrok.com/download
2. Download ngrok for Windows
3. Extract the zip file to a folder (e.g., C:\ngrok)
4. Or install via: `npm install -g ngrok`

## Step 2: Sign Up (Free)
1. Go to: https://dashboard.ngrok.com/signup
2. Create free account
3. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken

## Step 3: Setup Auth Token
Open PowerShell and run:
```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## Step 4: Start Your Dev Server
```powershell
npm run dev
```
(Make sure it's running on port 3000)

## Step 5: Start Ngrok
Open NEW PowerShell window and run:
```powershell
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

## Step 6: Use the HTTPS URL
- Copy the `https://abc123.ngrok.io` URL
- Open it on your phone - camera will work!
- Share this URL with anyone to test your app

## Alternative: NPM Method
```powershell
# Install globally
npm install -g ngrok

# Run ngrok
ngrok http 3000
```

## Tips:
- ✅ Free tier gives you random URLs (resets each time)
- ✅ Camera works because it's HTTPS
- ✅ Anyone can access your app via the ngrok URL
- ⚠️ URL changes every time you restart ngrok (unless you pay)

## Quick Test:
After ngrok starts, open the HTTPS URL on your phone and try the QR scanner - it should work!
