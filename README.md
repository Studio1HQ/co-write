<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/co-write.webp" alt="Cowrite ChatGPT App with Velt: A collaborative document editor that runs inside ChatGPT as an MCP app" width="100%" />

<br />
<br />

# Cowrite ChatGPT App with Velt

### A collaborative document editor that runs inside ChatGPT as an MCP app

Cowrite is a TipTap editor widget served by an MCP server and opened from ChatGPT. Velt CRDT, comments, presence and cursors handle collaboration, and ChatGPT tools read and write the document.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Velt](https://img.shields.io/badge/Built_with_Velt-141414?style=for-the-badge)](https://velt.dev)

[Velt docs](https://docs.velt.dev) &nbsp;·&nbsp; [Velt](https://velt.dev) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

Cowrite is a real-time collaborative document editor that runs as a ChatGPT app. A React and TipTap editor widget is built and served locally, an MCP server exposes it to ChatGPT, and [Velt](https://velt.dev) provides CRDT sync, comments, presence and live cursors between users. ChatGPT can open the editor, read the document to summarise it, and write formatted content into it.

https://github.com/user-attachments/assets/b7a7cb80-ff90-40aa-bf94-0ff1341da009

## Features

- **TipTap editor**: Rich text with formatting, headings and lists.
- **Real-time collaboration**: Live edits and cursors from other users through Velt CRDT (`@veltdev/tiptap-crdt-react`).
- **Comments**: Comments on text selections with `@veltdev/tiptap-velt-comments`, a comment tool and a sidebar.
- **Presence**: `VeltPresence` in the header and `VeltCursor` in the editor.
- **AI tools**: Three MCP tools for ChatGPT: `cowrite-open`, `cowrite-get-content` and `cowrite-write-content`.
- **Smart formatting**: When ChatGPT writes content, lists, headings and paragraphs are detected and formatted.

## Tech stack

| Layer | Tool |
| --- | --- |
| Frontend | [React](https://react.dev/) 19, [Vite](https://vitejs.dev/) |
| Editor | [TipTap](https://tiptap.dev/) 3.14 |
| Collaboration | [Velt](https://velt.dev/) (React SDK, CRDT, TipTap comments) |
| Protocol | [Model Context Protocol](https://modelcontextprotocol.io) |
| MCP server | Node.js with SSE transport, `tsx` |
| Tunnel | [ngrok](https://ngrok.com) |
| Packaging | [pnpm](https://pnpm.io/) workspace |

## Getting started

### Prerequisites

- Node.js 18 or newer
- pnpm (or npm or yarn)
- An [ngrok](https://ngrok.com) account
- A Velt account and API key from the [Velt console](https://console.velt.dev)
- A ChatGPT account with Developer Mode available
- Chrome 142 or newer users: go to `chrome://flags/`, search for `local-network-access-check`, set it to Disabled and restart Chrome

### Installation

```bash
git clone https://github.com/Studio1HQ/co-write.git
cd co-write
pnpm install
```

Install ngrok and add your token:

```bash
brew install ngrok            # macOS, or download from ngrok.com
ngrok config add-authtoken YOUR_TOKEN
```

### Environment variables

Create a `.env` file in the root folder (not `.env.example`).

| Variable | Description |
| --- | --- |
| `VITE_VELT_API_KEY` | Your Velt API key from the [Velt console](https://console.velt.dev). Enables cursors, comments and CRDT sync. |

The server also reads `BASE_URL` and `PORT` from the environment.

### Run

Use three terminals.

Terminal 1, build and serve the widget on `http://localhost:4444`:

```bash
pnpm run build
pnpm run serve
```

Terminal 2, start the MCP server on `http://localhost:8000`:

```bash
cd cowrite_server
pnpm start
```

Terminal 3, expose the server:

```bash
ngrok http 8000
```

Copy the ngrok URL (like `https://abc123.ngrok-free.app`), then connect ChatGPT:

1. Open ChatGPT, go to Settings, and enable Developer Mode.
2. Go to Settings, Connectors, Create.
3. Set the name to `Cowrite` and the URL to `https://abc123.ngrok-free.app/mcp` (your ngrok URL). Trust the provider.
4. Enable Cowrite from the + menu in a chat.
5. Try: "Open cowrite", "Summarize the document", or "Write these notes in the document: Project deadline is Friday, Need to review code, Call with client at 3pm".

## How it works

1. ChatGPT renders the Cowrite widget in an iframe.
2. The widget syncs document content to the MCP server.
3. ChatGPT calls tools to read or write the document content.
4. Written content is formatted by detecting lists, headings and paragraphs.
5. Changes appear for all connected users through Velt.

Key paths: `src/cowrite/` is the widget (`cowrite.jsx`, `Header.jsx`, `MenuBar.jsx`, `mockUsers.js`), `cowrite_server/src/server.ts` is the MCP server (SSE endpoint at `/mcp`), and `build-all.mts` builds the widget assets served on port 4444.

Troubleshooting:

- **Environment variables not found**: Make sure `.env` is in the root, named exactly `.env`, and restart your terminal. If values still do not load, put the API key directly in `src/cowrite/cowrite.jsx`.
- **Editor does not appear**: Check all three terminals are running and the build finished. The ngrok URL should show "Cowrite MCP server listening...".
- **ChatGPT cannot connect**: Check the ngrok URL ends with `/mcp`, the server is on port 8000 and nothing else uses that port.
- **Collaboration not working**: Check `VITE_VELT_API_KEY`, then rebuild with `pnpm run build`.

## Resources

- [Velt documentation](https://docs.velt.dev): SDK guides and API reference.
- [Velt console](https://console.velt.dev): Create projects and API keys.
- [Velt](https://velt.dev): Product site.
- [TipTap](https://tiptap.dev): Editor docs.
- [Model Context Protocol](https://modelcontextprotocol.io): Protocol docs.
- [ngrok](https://ngrok.com): Tunnel used to expose the local MCP server.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Velt](https://velt.dev).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
