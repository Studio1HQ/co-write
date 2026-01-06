# Cowrite - AI-Powered Collaborative Document Editor

A real-time collaborative document editor with AI integration through ChatGPT. Write, edit, comment, and let AI help you summarize, format, and enhance your documents.

**Chrome 142+ Users:** You may need to disable the `local-network-access` flag:

- Go to `chrome://flags/`
- Search for `local-network-access-check`
- Set to **Disabled** → Restart Chrome

---

## What You Need

- Node.js 18 or newer
- pnpm (or npm/yarn)
- ngrok account ([ngrok.com](https://ngrok.com))
- Velt account ([console.velt.dev](https://console.velt.dev))

---

## Quick Start

### 1. Install

```bash
git clone <your-repo>
cd co-write
pnpm install
```

### 2. Setup Environment File

Create a `.env` file in the **root folder**:

```bash
VITE_VELT_API_KEY=your_velt_api_key_here
```

- Get your `VITE_VELT_API_KEY` from [console.velt.dev](https://console.velt.dev)
- This enables real-time collaboration features (cursors, comments, CRDT sync)

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

**Terminal 1** - Build and serve widget:

```bash
pnpm run build
pnpm run serve
```

This builds the React widget and serves it on `http://localhost:4444`

**Terminal 2** - Start MCP server:

```bash
cd cowrite_server
pnpm start
```

This starts the server on `http://localhost:8000`

**Terminal 3** - Expose to internet:

```bash
ngrok http 8000
```

Copy the URL ngrok gives you (like `https://abc123.ngrok-free.app`)

### 5. Connect to ChatGPT

1. Open ChatGPT → Settings → Enable **Developer Mode**
2. Go to **Settings → Connectors → Create**
3. Add:
   - Name: **Cowrite**
   - URL: `https://abc123.ngrok-free.app/mcp` (your ngrok URL)
   - Trust the provider ✓
4. Start chatting and enable Cowrite from the **+** menu
5. Try these commands:
   - _"Open cowrite"_ - Opens the document editor
   - _"Summarize the document"_ - AI reads and summarizes your content
   - _"Write these notes in the document: Project deadline is Friday, Need to review code, Call with client at 3pm"_ - AI formats and inserts content

---

## Common Issues

**"Environment variables not found"?**

- Make sure `.env` file exists in the root folder (not `.env.example`)
- Check the file name is exactly `.env`
- Restart terminal after creating `.env`
- If values don't pick up, add the API key directly in `src/cowrite/cowrite.jsx`

**Can't see the editor?**

- Check all 3 terminals are running
- Make sure build completed successfully (check Terminal 1)
- Try the ngrok URL in browser - should show "Cowrite MCP server listening..."

**ChatGPT can't connect?**

- Verify ngrok URL is correct and ends with `/mcp`
- Check Terminal 2 shows "Cowrite MCP server listening on http://localhost:8000"
- Make sure port 8000 isn't used by another process

**Collaboration features not working?**

- Check `VITE_VELT_API_KEY` is correct in `.env`
- Verify the API key is from [console.velt.dev](https://console.velt.dev)
- Rebuild the widget after adding the key: `pnpm run build`

---

## What's Inside

### Core Features

- **TipTap Editor** - Rich text editing with formatting, headings, lists
- **Real-time Collaboration** - See live cursors and edits from other users (Velt CRDT)
- **Comments & Annotations** - Add comments to any text selection
- **AI Integration** - ChatGPT can read, summarize, and write formatted content
- **Smart Formatting** - AI auto-detects and formats lists, headings, paragraphs

### Available AI Tools

1. **cowrite-open** - Opens the collaborative document editor
2. **cowrite-get-content** - Retrieves document content for AI analysis and summarization
3. **cowrite-write-content** - Writes formatted content with auto-detection of structure

### Tech Stack

- **Frontend**: React 19, TipTap 3.14, Velt React SDK
- **Backend**: Node.js MCP Server with SSE transport
- **Protocol**: Model Context Protocol (MCP)
- **Collaboration**: Velt CRDT for real-time sync

---

## How It Works

1. **Widget Rendering**: ChatGPT opens the Cowrite widget in an iframe
2. **Content Sync**: The widget automatically syncs document content to the MCP server
3. **AI Tools**: ChatGPT can call tools to read or write document content
4. **Smart Formatting**: AI detects lists, headings, and paragraphs in natural language requests
5. **Real-time Updates**: Changes appear instantly for all connected users

---

Built with [Velt](https://velt.dev), [TipTap](https://tiptap.dev), and [Model Context Protocol](https://modelcontextprotocol.io)
