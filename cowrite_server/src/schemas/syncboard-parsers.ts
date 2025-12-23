/**
 * Zod Parsers for Syncboard Tool Input Validation
 * These validate and parse the incoming tool arguments
 */

import { z } from "zod";

export const syncboardCommentParser = z.object({
  commentText: z.string(),
  targetUser: z.string().optional(),
  fromUserId: z.string().optional(),
  fromUserName: z.string().optional(),
  fromUserEmail: z.string().optional(),
});

export const syncboardReplyParser = z.object({
  commentId: z.string(),
  replyText: z.string(),
  fromUserId: z.string().optional(),
  fromUserName: z.string().optional(),
  fromUserEmail: z.string().optional(),
});

export const syncboardAnnotationParser = z.object({
  commentText: z.string(),
  location: z
    .object({
      id: z.string(),
      locationName: z.string().optional(),
    })
    .optional(),
  targetElement: z
    .object({
      elementId: z.string(),
    })
    .optional(),
  targetText: z
    .object({
      text: z.string(),
      occurrence: z.number().optional(),
    })
    .optional(),
  fromUserId: z.string().optional(),
  fromUserName: z.string().optional(),
  fromUserEmail: z.string().optional(),
});

export const syncboardCanvasParser = z.object({
  action: z.enum(["add-sticky", "add-rectangle", "add-ellipse", "add-arrow", "add-text", "add-draw"]),
  content: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  color: z.string().optional(),
});

export const syncboardGetCommentsParser = z.object({
  organizationId: z.string().optional(),
  documentId: z.string().optional(),
  annotationIds: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

export const syncboardUpdateAnnotationParser = z.object({
  organizationId: z.string().optional(),
  documentId: z.string().optional(),
  annotationIds: z.array(z.string()),
  status: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["default", "ongoing", "terminal"]),
      color: z.string().optional(),
    })
    .optional(),
  priority: z
    .object({
      id: z.string(),
      name: z.string(),
      color: z.string().optional(),
    })
    .optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export const syncboardUpdateCommentParser = z.object({
  organizationId: z.string().optional(),
  documentId: z.string().optional(),
  annotationId: z.string(),
  commentIds: z.array(z.number()),
  commentText: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export const syncboardDeleteAnnotationParser = z.object({
  organizationId: z.string().optional(),
  documentId: z.string().optional(),
  annotationIds: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

export const syncboardDeleteCommentParser = z.object({
  organizationId: z.string().optional(),
  documentId: z.string().optional(),
  annotationId: z.string(),
  commentIds: z.array(z.number()).optional(),
});

// Export types for TypeScript
export type SyncboardCommentInput = z.infer<typeof syncboardCommentParser>;
export type SyncboardReplyInput = z.infer<typeof syncboardReplyParser>;
export type SyncboardAnnotationInput = z.infer<typeof syncboardAnnotationParser>;
export type SyncboardCanvasInput = z.infer<typeof syncboardCanvasParser>;
export type SyncboardGetCommentsInput = z.infer<typeof syncboardGetCommentsParser>;
export type SyncboardUpdateAnnotationInput = z.infer<typeof syncboardUpdateAnnotationParser>;
export type SyncboardUpdateCommentInput = z.infer<typeof syncboardUpdateCommentParser>;
export type SyncboardDeleteAnnotationInput = z.infer<typeof syncboardDeleteAnnotationParser>;
export type SyncboardDeleteCommentInput = z.infer<typeof syncboardDeleteCommentParser>;
