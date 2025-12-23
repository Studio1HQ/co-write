import { VELT_CONFIG, getVeltHeaders, VeltApiError } from './config.js';

/**
 * Parameters for deleting comment annotations
 */
export interface DeleteCommentAnnotationsParams {
  organizationId?: string;
  documentId: string;
  annotationIds?: string[];
  locationIds?: string[];
  userIds?: string[];
}

/**
 * Parameters for deleting comments
 */
export interface DeleteCommentsParams {
  organizationId: string;
  documentId: string;
  annotationId: string;
  commentIds?: number[];
}

/**
 * Delete comment annotations from a document
 * 
 * @param params - Parameters for deleting comment annotations
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Delete specific annotations by ID
 * await deleteCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationIds: ['annotation-1', 'annotation-2']
 * });
 * 
 * // Delete all annotations at a specific location
 * await deleteCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   locationIds: ['canvas-center']
 * });
 * 
 * // Delete all annotations created by specific users
 * await deleteCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   userIds: ['bob', 'alice']
 * });
 * 
 * // Delete all annotations in a document (use with caution!)
 * await deleteCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456'
 * });
 * ```
 */
export async function deleteCommentAnnotations(
  params: DeleteCommentAnnotationsParams
): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/delete`;

  const payload: any = {
    data: {
      documentId: params.documentId,
    },
  };

  // Add organizationId if provided
  if (params.organizationId) {
    payload.data.organizationId = params.organizationId;
  }

  // Add optional filters
  if (params.annotationIds && params.annotationIds.length > 0) {
    payload.data.annotationIds = params.annotationIds;
  }
  if (params.locationIds && params.locationIds.length > 0) {
    payload.data.locationIds = params.locationIds;
  }
  if (params.userIds && params.userIds.length > 0) {
    payload.data.userIds = params.userIds;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getVeltHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new VeltApiError(
        `Failed to delete comment annotations (${response.status})`,
        response.status,
        errorText
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof VeltApiError) {
      throw error;
    }
    throw new VeltApiError(
      'Failed to delete comment annotations',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Delete comments within a comment annotation
 * 
 * @param params - Parameters for deleting comments
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Delete specific comments by ID
 * await deleteComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789',
 *   commentIds: [12345, 67890]
 * });
 * 
 * // Delete all comments in an annotation (use with caution!)
 * await deleteComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789'
 * });
 * ```
 */
export async function deleteComments(params: DeleteCommentsParams): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/comments/delete`;

  const payload: any = {
    data: {
      organizationId: params.organizationId,
      documentId: params.documentId,
      annotationId: params.annotationId,
    },
  };

  // Add optional comment IDs filter
  if (params.commentIds && params.commentIds.length > 0) {
    payload.data.commentIds = params.commentIds;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getVeltHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new VeltApiError(
        `Failed to delete comments (${response.status})`,
        response.status,
        errorText
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof VeltApiError) {
      throw error;
    }
    throw new VeltApiError(
      'Failed to delete comments',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}
