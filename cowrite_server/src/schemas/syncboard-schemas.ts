/**
 * JSON Schemas for Syncboard MCP Tools
 * These define the input structure for ChatGPT tool calls
 */

export const syncboardCommentSchema = {
    type: "object",
    properties: {
      commentText: {
        type: "string",
        description: "The text content of the comment to add",
      },
      targetUser: {
        type: "string",
        description: "Optional: User ID to tag/mention in the comment (use @username format)",
      },
      fromUserId: {
        type: "string",
        description: "User ID of the person adding the comment. Use 'bob' for Bob Smith or 'alice' for Alice Cooper.",
      },
      fromUserName: {
        type: "string",
        description: "Display name of the person adding the comment.",
      },
      fromUserEmail: {
        type: "string",
        description: "Email of the person adding the comment.",
      },
    },
    required: ["commentText"],
    additionalProperties: false,
  } as const;
  
  export const syncboardReplySchema = {
    type: "object",
    properties: {
      commentId: {
        type: "string",
        description: "The ID of the comment to reply to",
      },
      replyText: {
        type: "string",
        description: "The text content of the reply",
      },
      fromUserId: {
        type: "string",
        description: "User ID of the person adding the reply.",
      },
      fromUserName: {
        type: "string",
        description: "Display name of the person adding the reply.",
      },
      fromUserEmail: {
        type: "string",
        description: "Email of the person adding the reply.",
      },
    },
    required: ["commentId", "replyText"],
    additionalProperties: false,
  } as const;
  
  export const syncboardAnnotationSchema = {
    type: "object",
    properties: {
      commentText: {
        type: "string",
        description: "The text content of the comment annotation",
      },
      location: {
        type: "object",
        description: "Location context where the annotation should appear.",
        properties: {
          id: {
            type: "string",
            description: "Location ID - REQUIRED. Convert natural language to kebab-case.",
          },
          locationName: {
            type: "string",
            description: "Human-readable location name (optional).",
          },
        },
        required: ["id"],
      },
      targetElement: {
        type: "object",
        description: "Specific element to attach the annotation to",
        properties: {
          elementId: {
            type: "string",
            description: "DOM element ID or shape ID to target",
          },
        },
      },
      targetText: {
        type: "object",
        description: "Specific text to attach the annotation to",
        properties: {
          text: {
            type: "string",
            description: "The text content to target",
          },
          occurrence: {
            type: "number",
            description: "Which occurrence of the text",
          },
        },
      },
      fromUserId: {
        type: "string",
        description: "User ID of the person adding the annotation.",
      },
      fromUserName: {
        type: "string",
        description: "Display name of the person adding the annotation.",
      },
      fromUserEmail: {
        type: "string",
        description: "Email of the person adding the annotation.",
      },
    },
    required: ["commentText"],
    additionalProperties: false,
  } as const;
  
  export const syncboardCanvasSchema = {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["add-sticky", "add-rectangle", "add-ellipse", "add-arrow", "add-text", "add-draw"],
        description: "The type of shape or element to add to the canvas",
      },
      content: {
        type: "string",
        description: "Text content for sticky notes or text shapes",
      },
      x: {
        type: "number",
        description: "X coordinate position on the canvas (optional, defaults to center)",
      },
      y: {
        type: "number",
        description: "Y coordinate position on the canvas (optional, defaults to center)",
      },
      width: {
        type: "number",
        description: "Width of the shape (optional)",
      },
      height: {
        type: "number",
        description: "Height of the shape (optional)",
      },
      color: {
        type: "string",
        description: "Color of the shape",
      },
    },
    required: ["action"],
    additionalProperties: false,
  } as const;
  
  export const syncboardGetCommentsSchema = {
    type: "object",
    properties: {
      organizationId: {
        type: "string",
        description: "Organization ID (optional)",
      },
      documentId: {
        type: "string",
        description: "Document ID (optional)",
      },
      annotationIds: {
        type: "array",
        items: { type: "string" },
        description: "Filter by specific annotation IDs",
      },
      locationIds: {
        type: "array",
        items: { type: "string" },
        description: "Filter by location IDs",
      },
      userIds: {
        type: "array",
        items: { type: "string" },
        description: "Filter by user IDs who authored comments",
      },
    },
    additionalProperties: false,
  } as const;
  
  export const syncboardUpdateAnnotationSchema = {
    type: "object",
    properties: {
      organizationId: { type: "string", description: "Organization ID (optional)" },
      documentId: { type: "string", description: "Document ID (optional)" },
      annotationIds: {
        type: "array",
        items: { type: "string" },
        description: "IDs of annotations to update",
      },
      status: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          type: { type: "string", enum: ["default", "ongoing", "terminal"] },
          color: { type: "string" },
        },
        description: "Update annotation status",
      },
      priority: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          color: { type: "string" },
        },
        description: "Update annotation priority",
      },
      context: {
        type: "object",
        description: "Update custom metadata",
      },
    },
    required: ["annotationIds"],
    additionalProperties: false,
  } as const;
  
  export const syncboardUpdateCommentSchema = {
    type: "object",
    properties: {
      organizationId: { type: "string", description: "Organization ID (optional)" },
      documentId: { type: "string", description: "Document ID (optional)" },
      annotationId: {
        type: "string",
        description: "ID of the annotation containing the comment",
      },
      commentIds: {
        type: "array",
        items: { type: "number" },
        description: "IDs of comments to update",
      },
      commentText: {
        type: "string",
        description: "Updated comment text",
      },
      context: {
        type: "object",
        description: "Update custom metadata",
      },
    },
    required: ["annotationId", "commentIds"],
    additionalProperties: false,
  } as const;
  
  export const syncboardDeleteAnnotationSchema = {
    type: "object",
    properties: {
      organizationId: { type: "string", description: "Organization ID (optional)" },
      documentId: { type: "string", description: "Document ID (optional)" },
      annotationIds: {
        type: "array",
        items: { type: "string" },
        description: "IDs of annotations to delete",
      },
      locationIds: {
        type: "array",
        items: { type: "string" },
        description: "Delete all annotations at these locations",
      },
      userIds: {
        type: "array",
        items: { type: "string" },
        description: "Delete all annotations created by these users",
      },
    },
    additionalProperties: false,
  } as const;
  
  export const syncboardDeleteCommentSchema = {
    type: "object",
    properties: {
      organizationId: { type: "string", description: "Organization ID (optional)" },
      documentId: { type: "string", description: "Document ID (optional)" },
      annotationId: {
        type: "string",
        description: "ID of the annotation containing the comments",
      },
      commentIds: {
        type: "array",
        items: { type: "number" },
        description: "IDs of specific comments to delete",
      },
    },
    required: ["annotationId"],
    additionalProperties: false,
  } as const;
  