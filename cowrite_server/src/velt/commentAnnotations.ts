/**
 * Velt Comment Annotations API
 * Handles adding comment annotations with location targeting
 */

import { VELT_CONFIG, getVeltHeaders, VeltApiError, type VeltUser } from "./config.js";

export interface CommentAnnotationLocation {
  id?: string;
  locationName?: string;
}

export interface TargetElement {
  elementId: string;
}

export interface TargetText {
  targetText: string;
  occurrence?: number;
  selectAllContent?: boolean;
}

export interface CommentData {
  commentId?: string;
  commentText?: string;
  commentHtml?: string;
  from: VeltUser;
  context?: Record<string, any>;
  triggerNotification?: boolean;
  createdAt?: number;
}

export interface AddCommentAnnotationParams {
  organizationId?: string;
  documentId?: string;
  annotationId?: string;
  location?: CommentAnnotationLocation;
  targetElement?: TargetElement;
  targetText?: TargetText;
  commentData: CommentData[];
}

/**
 * Add a comment annotation to a specific location, element, or text
 * 
 * @param params - Comment annotation parameters
 * @returns API response data
 * 
 * @example
 * // Add comment at a specific location
 * await addCommentAnnotation({
 *   location: { id: "header-section" },
 *   commentData: [{
 *     commentText: "Great work!",
 *     from: { userId: "bob", name: "Bob Smith", email: "bob@example.com" }
 *   }]
 * });
 * 
 * @example
 * // Add comment on a specific element
 * await addCommentAnnotation({
 *   targetElement: { elementId: "canvas-shape-123" },
 *   commentData: [{
 *     commentText: "Nice shape!",
 *     from: { userId: "alice", name: "Alice Cooper" }
 *   }]
 * });
 * 
 * @example
 * // Add comment on specific text
 * await addCommentAnnotation({
 *   targetText: {
 *     targetText: "Important section",
 *     occurrence: 1
 *   },
 *   commentData: [{
 *     commentText: "Review this",
 *     from: { userId: "bob", name: "Bob Smith" }
 *   }]
 * });
 */
export async function addCommentAnnotation(
  params: AddCommentAnnotationParams
): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/add`;

  const body = {
    data: {
      organizationId: params.organizationId || VELT_CONFIG.ORGANIZATION_ID,
      documentId: params.documentId || VELT_CONFIG.DOCUMENT_ID,
      commentAnnotations: [
        {
          ...(params.annotationId && { annotationId: params.annotationId }),
          ...(params.location && { location: params.location }),
          ...(params.targetElement && { targetElement: params.targetElement }),
          ...(params.targetText && {
            targetElement: {
              targetText: params.targetText.targetText,
              ...(params.targetText.occurrence !== undefined && {
                occurrence: params.targetText.occurrence,
              }),
              ...(params.targetText.selectAllContent !== undefined && {
                selectAllContent: params.targetText.selectAllContent,
              }),
            },
          }),
          commentData: params.commentData,
        },
      ],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getVeltHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new VeltApiError(
        `Failed to add comment annotation (${response.status})`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error adding comment annotation via Velt API:", error);
    throw error;
  }
}

/**
 * Helper function to process @mentions in comment text
 * Wraps userId in double curly braces for Velt to replace with user name
 */
export function processMentions(text: string, targetUser?: string): string {
  if (!targetUser) return text;
  
  const userId = targetUser.replace("@", "");
  return `{{${userId}}} ${text}`;
}
