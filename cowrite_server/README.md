# Cowrite MCP Server (Node)


## Features

- **Canvas Operations**: Add sticky notes, rectangles, circles, arrows, and text to the whiteboard
- **Comment System**: Add comments with user attribution (Bob/Alice)
- **State Management**: Query current board state including all shapes, positions, colors, and text content
- **Velt Integration**: Real-time collaboration features with cursor tracking and presence
- **tldraw Sync**: Multi-user whiteboard synchronization

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn for dependency management
- Velt API key (get one at [velt.dev](https://velt.dev))
- Velt Auth Token configured in environment variables

## Install Dependencies

```bash
pnpm install
```

If you prefer npm or yarn, adjust the command accordingly.

## Configuration

Create a `.env` file in the project root:

```env
VELT_API_KEY=your_velt_api_key_here
VELT_AUTH_TOKEN=your_velt_auth_token_here
PORT=8000
```

## Build the Widget

Before running the server, build the Syncboard widget assets:

```bash
pnpm build
```

This generates the widget HTML files in the `assets/` directory.

## Run the Server

```bash
pnpm start
```

The server starts on `http://localhost:8000` using SSE (Server-Sent Events) transport, making it compatible with the MCP Inspector and ChatGPT connectors.

## Available Tools

The server exposes the following MCP tools:

### Canvas Actions
- **`syncboard-canvas-action`**: Add shapes to the canvas (sticky notes, rectangles, ellipses, arrows, text)

### State Management
- **`syncboard-get-state`**: Get current board state with all shapes, positions, text, colors, pages, and viewport info

### Comments & Annotations
- **`syncboard-add-comment`**: Add a comment to the whiteboard with user attribution

## Tool Response Structure

Each tool responds with:

- **`content`**: Human-readable text confirmation of the action
- **`structuredContent`**: JSON payload with action details and board state data
- **`_meta`**: OpenAI widget metadata for rendering the Syncboard UI

## Example Usage

Once connected to ChatGPT, you can:

```
"Add a yellow sticky note with the text 'Meeting at 3pm'"
→ Creates a note shape on the canvas

"What shapes are currently on the board?"
→ Returns UI with totalShapes, shapesByType, shapesDetails, etc.

"Add a comment as Bob saying 'Great idea!'"
→ Adds a comment attributed to Bob Smith

```

## Architecture

- **Server**: Node.js + TypeScript MCP server using `@modelcontextprotocol/sdk`
- **Widget**: React + tldraw + Velt SDK for real-time collaboration
- **Transport**: SSE (Server-Sent Events) for ChatGPT integration
- **Validation**: Zod schemas for type-safe input parsing

## Project Structure

```
syncboard_server/
├── src/
│   ├── server.ts                 # Main MCP server
│   ├── schemas/
│   │   ├── syncboard.schemas.ts  # JSON schemas for tool inputs
│   │   └── syncboard.parsers.ts  # Zod parsers for validation
│   └── velt/
│       └── index.ts              # Velt API integration
├── assets/                       # Built widget HTML/JS
├── package.json
└── tsconfig.json
```

## Development

To modify the Syncboard widget:

1. Edit the React components in your widget source directory
2. Run `pnpm build` to rebuild assets
3. Restart the server with `pnpm start`

## Extending the Server

You can extend the server with additional tools by:

1. Creating new schemas in `src/schemas/syncboard.schemas.ts`
2. Adding parsers in `src/schemas/syncboard.parsers.ts`
3. Implementing tool handlers in `src/server.ts`
4. Following the existing pattern for structuredContent and _meta responses

## Debugging

Enable debug logging by setting:

```bash
DEBUG=mcp:* pnpm start
```

Check the MCP Inspector for real-time tool invocation testing without ChatGPT.

Built with ❤️ using [Model Context Protocol](https://modelcontextprotocol.io), [Velt SDK](https://velt.dev), and [tldraw](https://tldraw.dev)
