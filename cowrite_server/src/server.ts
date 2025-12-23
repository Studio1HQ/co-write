import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import fs from "node:fs";
import path from "node:path";
import { URL, fileURLToPath } from "node:url";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  type CallToolRequest,
  type ListResourceTemplatesRequest,
  type ListResourcesRequest,
  type ListToolsRequest,
  type ReadResourceRequest,
  type Resource,
  type ResourceTemplate,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

type CowriteWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  responseText: string;
};

// In-memory storage for document content
const documentStates = new Map<string, any>();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const ASSETS_DIR = path.resolve(ROOT_DIR, "assets");

function readWidgetHtml(componentName: string): string {
  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(
      `Widget assets not found. Expected directory ${ASSETS_DIR}. Run "pnpm run build" before starting the server.`
    );
  }

  const directPath = path.join(ASSETS_DIR, `${componentName}.html`);
  let htmlContents: string | null = null;

  if (fs.existsSync(directPath)) {
    htmlContents = fs.readFileSync(directPath, "utf8");
  } else {
    const candidates = fs
      .readdirSync(ASSETS_DIR)
      .filter(
        (file) => file.startsWith(`${componentName}-`) && file.endsWith(".html")
      )
      .sort();
    const fallback = candidates[candidates.length - 1];
    if (fallback) {
      htmlContents = fs.readFileSync(path.join(ASSETS_DIR, fallback), "utf8");
    }
  }

  if (!htmlContents) {
    throw new Error(
      `Widget HTML for "${componentName}" not found in ${ASSETS_DIR}. Run "pnpm run build" to generate the assets.`
    );
  }

  return htmlContents;
}

function widgetDescriptorMeta(widget: CowriteWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  } as const;
}

function widgetInvocationMeta(widget: CowriteWidget) {
  return {
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
  } as const;
}

const widgets: CowriteWidget[] = [
  {
    id: "cowrite",
    title: "Open Cowrite",
    templateUri: "ui://widget/cowrite.html",
    invoking: "Loading collaborative document editor",
    invoked: "Cowrite ready",
    html: readWidgetHtml("cowrite"),
    responseText: "Opened Cowrite editor!",
  },
];

const widgetsById = new Map<string, CowriteWidget>();
const widgetsByUri = new Map<string, CowriteWidget>();

widgets.forEach((widget) => {
  widgetsById.set(widget.id, widget);
  widgetsByUri.set(widget.templateUri, widget);
});

// Get the cowrite widget
const cowriteWidget = widgetsById.get("cowrite");
if (!cowriteWidget) {
  throw new Error("Cowrite widget not found in widgets array");
}

// Define tools
const cowriteTools: Tool[] = [
  {
    name: "cowrite-open",
    description:
      "Open the Cowrite collaborative document editor. Use this when the user wants to open, start, or launch Cowrite.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    title: "Open Cowrite Editor",
    _meta: widgetDescriptorMeta(cowriteWidget),
    annotations: {
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true,
    },
  },
  {
    name: "cowrite-get-content",
    description:
      "Get the current content of the Cowrite document for analysis, summarization, review, or answering questions. Use this when the user asks to summarize, analyze, review, explain, or get information about what's written in the document. Returns the document content in both HTML and plain text formats along with metadata like word count and character count.",
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: ["html", "plaintext", "both"],
          description: "Format of content to return. Default is 'both'.",
        },
      },
      additionalProperties: false,
    },
    title: "Get Document Content",
    annotations: {
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true,
    },
  },
];

// Combine all tools
const allTools = [...cowriteTools];

const resources: Resource[] = widgets.map((widget) => ({
  uri: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetDescriptorMeta(widget),
}));

const resourceTemplates: ResourceTemplate[] = widgets.map((widget) => ({
  uriTemplate: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetDescriptorMeta(widget),
}));

function createCowriteServer(): Server {
  const server = new Server(
    {
      name: "cowrite-node",
      version: "0.1.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  server.setRequestHandler(
    ListResourcesRequestSchema,
    async (_request: ListResourcesRequest) => ({
      resources,
    })
  );

  server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {
      const widget = widgetsByUri.get(request.params.uri);

      if (!widget) {
        throw new Error(`Unknown resource: ${request.params.uri}`);
      }

      return {
        contents: [
          {
            uri: widget.templateUri,
            mimeType: "text/html+skybridge",
            text: widget.html,
            _meta: widgetDescriptorMeta(widget),
          },
        ],
      };
    }
  );

  server.setRequestHandler(
    ListResourceTemplatesRequestSchema,
    async (_request: ListResourceTemplatesRequest) => ({
      resourceTemplates,
    })
  );

  server.setRequestHandler(
    ListToolsRequestSchema,
    async (_request: ListToolsRequest) => ({
      tools: allTools,
    })
  );

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const toolName = request.params.name;

      // Handle cowrite-open tool
      if (toolName === "cowrite-open") {
        const cowriteWidget = widgetsById.get("cowrite");
        if (!cowriteWidget) {
          throw new Error("Cowrite widget not found");
        }

        return {
          content: [
            {
              type: "text",
              text: "Opening Cowrite collaborative document editor...",
            },
          ],
          _meta: widgetInvocationMeta(cowriteWidget),
        };
      }

      // Handle cowrite-get-content tool
      if (toolName === "cowrite-get-content") {
        const args = (request.params.arguments ?? {}) as {
          format?: "html" | "plaintext" | "both";
        };
        const format = args.format || "both";

        // Get cached document content
        const sessionId = "default";
        const cachedDoc = documentStates.get(sessionId);

        // Check if document has content
        if (!cachedDoc || !cachedDoc.html || cachedDoc.html === "<p></p>") {
          return {
            content: [
              {
                type: "text",
                text: "📄 The document is currently empty. No content has been written yet.",
              },
            ],
          };
        }

        // Check if content is stale (older than 5 minutes)
        const isStale = Date.now() - cachedDoc.timestamp > 300000;
        const staleWarning = isStale
          ? " ⚠️ Note: This content may be slightly outdated."
          : "";

        // Prepare content based on format
        let contentText = "";
        if (format === "html") {
          contentText = `📄 **Document Content (HTML)**${staleWarning}\n\n${cachedDoc.html}`;
        } else if (format === "plaintext") {
          contentText = `📄 **Document Content (Plain Text)**${staleWarning}\n\n${cachedDoc.plainText}`;
        } else {
          contentText =
            `📄 **Document Content**${staleWarning}\n\n` +
            `**Plain Text:**\n${cachedDoc.plainText}\n\n` +
            `**Word Count:** ${cachedDoc.wordCount || 0}\n` +
            `**Character Count:** ${cachedDoc.charCount || 0}\n\n` +
            `**HTML:**\n${cachedDoc.html}`;
        }

        return {
          content: [
            {
              type: "text",
              text: contentText,
            },
          ],
        };
      }

      // Handle if no tool matched
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${toolName}. Available tools: cowrite-open, cowrite-get-content`,
          },
        ],
        isError: true,
      };
    }
  );

  return server;
}

type SessionRecord = {
  server: Server;
  transport: SSEServerTransport;
};

const sessions = new Map<string, SessionRecord>();

const ssePath = "/mcp";
const postPath = "/mcp/messages";
const documentContentPath = "/api/document-content";

async function handleDocumentContentPost(
  req: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const sessionId = data.sessionId || "default";

      // Store the document content with metadata
      documentStates.set(sessionId, {
        html: data.html || "",
        plainText: data.plainText || "",
        wordCount: data.wordCount || 0,
        charCount: data.charCount || 0,
        timestamp: Date.now(),
      });

      console.log(
        `📝 Document content updated (${data.wordCount || 0} words, ${
          data.charCount || 0
        } characters)`
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error("Failed to parse document content:", error);
      res.writeHead(400).end("Invalid JSON");
    }
  });
}

async function handleSseRequest(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const server = createCowriteServer();
  const transport = new SSEServerTransport(postPath, res);
  const sessionId = transport.sessionId;

  sessions.set(sessionId, { server, transport });

  transport.onclose = async () => {
    sessions.delete(sessionId);
    await server.close();
  };

  transport.onerror = (error) => {
    console.error("SSE transport error", error);
  };

  try {
    await server.connect(transport);
  } catch (error) {
    sessions.delete(sessionId);
    console.error("Failed to start SSE session", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to establish SSE connection");
    }
  }
}

async function handlePostMessage(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    res.writeHead(400).end("Missing sessionId query parameter");
    return;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    res.writeHead(404).end("Unknown session");
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("Failed to process message", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to process message");
    }
  }
}

const portEnv = Number(process.env.PORT ?? 8000);
const port = Number.isFinite(portEnv) ? portEnv : 8000;

const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(400).end("Missing URL");
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (
      req.method === "OPTIONS" &&
      (url.pathname === ssePath ||
        url.pathname === postPath ||
        url.pathname === documentContentPath)
    ) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
      });
      res.end();
      return;
    }

    if (req.method === "POST" && url.pathname === documentContentPath) {
      await handleDocumentContentPost(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === ssePath) {
      await handleSseRequest(res);
      return;
    }

    if (req.method === "POST" && url.pathname === postPath) {
      await handlePostMessage(req, res, url);
      return;
    }

    res.writeHead(404).end("Not Found");
  }
);

httpServer.on("clientError", (err: Error, socket) => {
  console.error("HTTP client error", err);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

httpServer.listen(port, () => {
  console.log(`Cowrite MCP server listening on http://localhost:${port}`);
  console.log(`  SSE stream: GET http://localhost:${port}${ssePath}`);
  console.log(
    `  Message post endpoint: POST http://localhost:${port}${postPath}?sessionId=...`
  );
});
