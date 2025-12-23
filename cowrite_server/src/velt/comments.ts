/**
 * Velt Comments API
 * Handles adding comments and replies to existing annotations
 */

import { VELT_CONFIG, getVeltHeaders, VeltApiError, type VeltUser } from "./config.js";

export interface AddCommentParams {
  organizationId?: string;
  documentId?: string;
  commentText: string;
  fromUser: VeltUser;
  targetUser?: string;
}

export interface AddReplyParams {
  organizationId?: string;
  documentId?: string;
  annotationId: string;
  commentId: string;
  replyText: string;
  fromUser: VeltUser;
}

/**
 * Add a comment to a document (creates a new comment annotation)
 * 
 * @param params - Comment parameters
 * @returns API response data
 */
export async function addComment(params: AddCommentParams): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/add`;

  // Process comment text to include @mentions
  let processedCommentText = params.commentText;
  if (params.targetUser) {
    const userId = params.targetUser.replace("@", "");
    processedCommentText = `{{${userId}}} ${params.commentText}`;
  }

  const body = {
    data: {
      organizationId: params.organizationId || VELT_CONFIG.ORGANIZATION_ID,
      documentId: params.documentId || VELT_CONFIG.DOCUMENT_ID,
      commentAnnotations: [
        {
          commentData: [
            {
              commentText: processedCommentText,
              from: params.fromUser,
            },
          ],
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
        `Failed to add comment (${response.status})`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error adding comment via Velt API:", error);
    throw error;
  }
}

/**
 * Add a reply to an existing comment
 * 
 * @param params - Reply parameters
 * @returns API response data
 */
export async function addReply(params: AddReplyParams): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/comments/add`;

  const body = {
    data: {
      organizationId: params.organizationId || VELT_CONFIG.ORGANIZATION_ID,
      documentId: params.documentId || VELT_CONFIG.DOCUMENT_ID,
      annotationId: params.annotationId,
      commentData: [
        {
          commentId: params.commentId,
          commentText: params.replyText,
          from: params.fromUser,
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
        `Failed to add reply (${response.status})`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error adding reply via Velt API:", error);
    throw error;
  }
}
