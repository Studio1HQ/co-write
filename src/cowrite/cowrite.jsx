import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { TiptapVeltComments } from "@veltdev/tiptap-velt-comments";
import { addComment, renderComments } from "@veltdev/tiptap-velt-comments";
import { useVeltTiptapCrdtExtension } from "@veltdev/tiptap-crdt-react";
import {
  VeltProvider,
  VeltCursor,
  VeltComments,
  VeltCommentsSidebar,
  useVeltClient,
  useCommentAnnotations,
} from "@veltdev/react";
import { MessageCircle } from "lucide-react";
import { Header } from "./Header";
import { MenuBar } from "./MenuBar";
import { getDefaultUser } from "./mockUsers";
import "./cowrite.css";

function CowriteEditor() {
  const { client } = useVeltClient();
  const [veltReady, setVeltReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(getDefaultUser());
  const commentAnnotations = useCommentAnnotations();

  // Initialize Velt CRDT extension for real-time collaborative editing
  const { VeltCrdt, isLoading: crdtLoading } = useVeltTiptapCrdtExtension({
    editorId: "cowrite-doc-prod",
    initialContent: "<p></p>",
  });

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // Disable history when using collaboration
          history: false,
        }),
        Underline,
        TextStyle,
        Color,
        TiptapVeltComments.configure({
          persistVeltMarks: true,
        }),
        Placeholder.configure({
          placeholder: "Start writing your document...",
        }),
        // Add CRDT extension for real-time collaboration
        ...(VeltCrdt ? [VeltCrdt] : []),
      ],
      content: "",
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
        },
      },
    },
    [VeltCrdt]
  );

  // Handle structured content from window.openai.toolOutput
  useEffect(() => {
    if (!editor) return;

    const handleGlobalsChange = (event) => {
      console.log("[Cowrite] Globals changed:", event?.detail?.globals);
      const toolOutput =
        event?.detail?.globals?.toolOutput || window.openai?.toolOutput;
      console.log("[Cowrite] Tool output:", toolOutput);

      // Check if this is a write-content action
      if (toolOutput && toolOutput.action === "write-content") {
        console.log("[Cowrite] Processing write-content action");
        processWriteContent(toolOutput);
      }
    };

    // Process write content function
    const processWriteContent = (toolOutput) => {
      console.log("[Cowrite] processWriteContent called with:", toolOutput);
      if (!toolOutput.action === "write-content") return;
      const { content, format, append } = toolOutput;

      // Format the content based on the format type
      let htmlContent = "";

      if (format === "heading") {
        // Split content into lines and make first line h2, rest paragraphs
        const lines = content.split("\n").filter((line) => line.trim());
        if (lines.length > 0) {
          htmlContent = `<h2>${lines[0]}</h2>`;
          if (lines.length > 1) {
            htmlContent += lines
              .slice(1)
              .map((line) => `<p>${line}</p>`)
              .join("");
          }
        }
      } else if (format === "list") {
        // Convert to bullet list
        const lines = content.split("\n").filter((line) => line.trim());
        if (lines.length > 0) {
          htmlContent =
            "<ul>" + lines.map((line) => `<li>${line}</li>`).join("") + "</ul>";
        }
      } else if (format === "auto") {
        // Auto-detect: if multiple lines with bullets/numbers, make list
        // If starts with #, make heading
        // Otherwise make paragraphs
        const lines = content.split("\n");
        const trimmedLines = lines.filter((line) => line.trim());

        if (trimmedLines.length === 0) {
          htmlContent = `<p>${content}</p>`;
        } else if (content.trim().startsWith("#")) {
          // Looks like a heading
          const cleanContent = content.trim().replace(/^#+\s*/, "");
          htmlContent = `<h2>${cleanContent}</h2>`;
        } else if (
          trimmedLines.some(
            (line) =>
              /^[\-\*•]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())
          )
        ) {
          // Looks like a list
          const listItems = trimmedLines
            .map((line) => {
              const cleaned = line
                .trim()
                .replace(/^[\-\*•]\s*/, "")
                .replace(/^\d+\.\s*/, "");
              return `<li>${cleaned}</li>`;
            })
            .join("");
          htmlContent = `<ul>${listItems}</ul>`;
        } else if (trimmedLines.length === 1) {
          // Single line - make it a paragraph
          htmlContent = `<p>${content.trim()}</p>`;
        } else {
          // Multiple lines - make paragraphs
          htmlContent = trimmedLines.map((line) => `<p>${line}</p>`).join("");
        }
      } else {
        // Default: paragraph format
        const lines = content.split("\n").filter((line) => line.trim());
        htmlContent = lines.map((line) => `<p>${line}</p>`).join("");
      }

      // Insert content into editor
      console.log(
        "[Cowrite] Inserting content, append:",
        append,
        "htmlContent:",
        htmlContent
      );
      if (append) {
        // Append to end
        editor
          .chain()
          .focus()
          .setContent(editor.getHTML() + htmlContent)
          .run();
      } else {
        // Replace all content
        editor.chain().focus().setContent(htmlContent).run();
      }

      // Send updated content to server
      sendDocumentContent();
    };

    // Listen for host global updates
    window.addEventListener("openai:set_globals", handleGlobalsChange);

    // Check initial toolOutput on mount
    if (window.openai?.toolOutput?.action === "write-content") {
      processWriteContent(window.openai.toolOutput);
    }

    return () => {
      window.removeEventListener("openai:set_globals", handleGlobalsChange);
    };
  }, [editor]);

  // Send document content to MCP server
  const sendDocumentContent = async () => {
    if (!editor) return;

    const html = editor.getHTML();
    const plainText = editor.getText();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const charCount = plainText.length;

    try {
      await fetch("http://localhost:8000/api/document-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: "default",
          html,
          plainText,
          wordCount,
          charCount,
        }),
      });
    } catch (error) {
      console.error("Failed to send document content to server:", error);
    }
  };

  // Send content to server periodically when editor changes
  useEffect(() => {
    if (!editor) return;

    // Send initial content
    sendDocumentContent();

    // Set up debounced content sync (wait 2 seconds after user stops typing)
    let timeoutId;
    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sendDocumentContent();
      }, 2000);
    };

    editor.on("update", handleUpdate);

    // Also send immediately on blur to catch any final changes
    const handleBlur = () => {
      clearTimeout(timeoutId);
      sendDocumentContent();
    };

    editor.on("blur", handleBlur);

    return () => {
      clearTimeout(timeoutId);
      editor.off("update", handleUpdate);
      editor.off("blur", handleBlur);
    };
  }, [editor]);

  // Initialize Velt when client is ready
  useEffect(() => {
    const initializeVelt = async () => {
      if (!client || veltReady) return;

      try {
        // Wait for Velt to fully initialize
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Identify user with forceReset to ensure clean state
        await client.identify(currentUser, {
          forceReset: true,
        });

        // Set document
        await client.setDocument("cowrite-doc-prod", {
          documentName: "Cowrite Collaborative Document",
        });

        setVeltReady(true);
      } catch (error) {
        console.error("Velt initialization error:", error);
      }
    };

    initializeVelt();
  }, [client, veltReady, currentUser]);

  // Render comments in TipTap editor when annotations change
  useEffect(() => {
    if (editor && commentAnnotations?.length) {
      renderComments({
        editor,
        commentAnnotations,
      });
    }
  }, [editor, commentAnnotations]);

  // Handle user switching
  const handleUserSwitch = async (newUser) => {
    if (!client || newUser.userId === currentUser.userId) return;

    try {
      setVeltReady(false);

      // Sign out current user first
      await client.signOutUser();

      // Wait a bit for cleanup
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update current user state
      setCurrentUser(newUser);

      // Identify new user with forceReset
      await client.identify(newUser, {
        forceReset: true,
      });

      // Set document for new user
      await client.setDocument("cowrite-doc-prod", {
        documentName: "Cowrite Collaborative Document",
      });

      setVeltReady(true);
    } catch (error) {
      console.error("User switch error:", error);
      setVeltReady(true);
    }
  };

  // Handler for adding Velt comments from BubbleMenu
  const handleAddComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editor) {
      addComment({ editor });
    }
  };

  return (
    <div className="cowrite-container">
      {/* Header with user switcher and Velt tools */}
      <Header
        currentUser={currentUser}
        onUserSwitch={handleUserSwitch}
        veltReady={veltReady}
      />

      {/* Velt Cursor for collaboration */}
      {veltReady && <VeltCursor />}

      {/* Velt Comments with textMode disabled for TipTap */}
      {veltReady && <VeltComments textMode={false} />}

      {/* Main Editor */}
      <div className="editor-wrapper">
        <MenuBar editor={editor} />
        <div className="editor-content">
          <EditorContent editor={editor} />

          {/* BubbleMenu for adding comments on text selection */}
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100, placement: "top" }}
              className="bubble-menu-container"
            >
              <button
                className="bubble-menu-comment-btn"
                onClick={handleAddComment}
                title="Add comment"
              >
                <MessageCircle size={16} />
                <span>Comment</span>
              </button>
            </BubbleMenu>
          )}
        </div>
      </div>

      {/* Velt Comments Sidebar */}
      {veltReady && <VeltCommentsSidebar />}
    </div>
  );
}

export default function Cowrite() {
  const [providerError, setProviderError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_VELT_API_KEY;
    if (!apiKey) {
      setProviderError(
        "VITE_VELT_API_KEY is missing. Please add it to your .env file."
      );
    }
  }, []);

  if (providerError) {
    return (
      <div className="error-container">
        <h2>⚠️ Configuration Error</h2>
        <p>{providerError}</p>
      </div>
    );
  }

  return (
    <VeltProvider apiKey={import.meta.env.VITE_VELT_API_KEY || "demo-key"}>
      <CowriteEditor />
    </VeltProvider>
  );
}
