#

**Chrome 142+ Users:** You may need to disable the `local-network-access` flag:
- Go to `chrome://flags/`
- Search for `local-network-access-check`
- Set to **Disabled** → Restart Chrome

***

## What You Need

- Node.js 18 or newer
- pnpm (or npm/yarn)
- ngrok account ([ngrok.com](https://ngrok.com))
- Velt account ([console.velt.dev](https://console.velt.dev))
- tldraw license key ([tldraw.dev](https://tldraw.dev))

***

## Quick Start

### 1. Install

```bash
git clone <your-repo>
cd velt-app-examples
pnpm install
```

### 2. Setup Environment Files

You need **two** `.env` files:

#### **Root folder** `.env`
```bash
VITE_TLDRAW_LICENSE_KEY=your_license_key_here
VITE_TLDRAW_ROOM_ID=my-whiteboard-room
```

- Get `VITE_TLDRAW_LICENSE_KEY` from [tldraw.dev](https://tldraw.dev)
- Set `VITE_TLDRAW_ROOM_ID` to any name you want (like "team-whiteboard")

#### **syncboard_server folder** `.env`
```bash
VELT_API_KEY=your_api_key_here
VELT_AUTH_TOKEN=your_auth_token_here
PORT=8000
```

- Use the **same** API key as above
- Get `VITE_VELT_API_KEY` from [console.velt.dev](https://console.velt.dev)
- Get `VELT_AUTH_TOKEN` from [console.velt.dev](https://console.velt.dev) → Auth Token section

### 3. Setup ngrok

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from ngrok.com

# Login with your auth token
ngrok config add-authtoken YOUR_TOKEN
```

Get your ngrok token from [dashboard.ngrok.com](https://dashboard.ngrok.com)

### 4. Build & Run

Open **3 terminals**:

**Terminal 1** - Build and serve files:
```bash
pnpm run build
pnpm run serve
```

**Terminal 2** - Start server:
```bash
cd syncboard_server
pnpm start
```

**Terminal 3** - Expose to internet:
```bash
ngrok http 8000
```

Copy the URL ngrok gives you (like `https://abc123.ngrok-free.app`)

### 5. Connect to ChatGPT

1. Open ChatGPT → Settings → Enable **Developer Mode**
2. Go to **Settings → Connectors → Create**
3. Add:
   - Name: **Syncboard**
   - URL: `https://abc123.ngrok-free.app/mcp` (your ngrok URL)
   - Trust the provider ✓
4. Start chatting and enable Syncboard from the **+** menu
5. Try: *"Add a yellow sticky note that says hello"*

***

## Common Issues

**"Environment variables not found"?**
- Make sure `.env` files exist (not `.env.example`)
- Check file names are exactly `.env`
- Restart the server after creating `.env`
- Sometimes values does not pick up from `.env` so, add directly into the code

**Can't see the whiteboard?**
- Check all 3 terminals are running
- Try the ngrok URL in a browser - it should show something

**Comments not working?**
- Check `VELT_AUTH_TOKEN` is correct
- Make sure you copied both API key AND auth token

***

## What's Inside

- Real-time collaborative whiteboard (tldraw)
- Comments, annotations, real-time collaboration (Velt)
- Works through ChatGPT conversations
- Add shapes, sticky notes, text, arrows

***

Built with [Velt](https://velt.dev), [tldraw](https://tldraw.dev), and [Model Context Protocol](https://modelcontextprotocol.io)