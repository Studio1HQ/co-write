import { VELT_CONFIG, getVeltHeaders, VeltApiError } from './config.js';

/**
 * Parameters for getting comment annotations
 */
export interface GetCommentAnnotationsParams {
  organizationId: string;
  documentId?: string;
  documentIds?: string[];
  locationIds?: string[];
  annotationIds?: string[];
  userIds?: string[];
  statusIds?: string[];
  groupByDocumentId?: boolean;
  pageSize?: number;
  pageToken?: string;
  updatedAfter?: number;
  updatedBefore?: number;
  createdAfter?: number;
  createdBefore?: number;
}

/**
 * Parameters for getting comments within an annotation
 */
export interface GetCommentsParams {
  organizationId: string;
  documentId: string;
  annotationId: string;
  commentIds?: number[];
  pageSize?: number;
  pageToken?: string;
}

/**
 * Get comment annotations from a document
 * 
 * @param params - Parameters for getting comment annotations
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Get all annotations for a document
 * const annotations = await getCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456'
 * });
 * 
 * // Get specific annotations by ID
 * const specific = await getCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationIds: ['annotation-1', 'annotation-2']
 * });
 * 
 * // Get annotations by location
 * const byLocation = await getCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   locationIds: ['canvas-center', 'header-section']
 * });
 * 
 * // Get annotations across multiple documents
 * const multiDoc = await getCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentIds: ['doc-1', 'doc-2'],
 *   groupByDocumentId: true
 * });
 * ```
 */
export async function getCommentAnnotations(
  params: GetCommentAnnotationsParams
): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/get`;

  const payload: any = {
    data: {
      organizationId: params.organizationId,
    },
  };

  // Add optional filters
  if (params.documentId) {
    payload.data.documentId = params.documentId;
  }
  if (params.documentIds && params.documentIds.length > 0) {
    payload.data.documentIds = params.documentIds;
  }
  if (params.locationIds && params.locationIds.length > 0) {
    payload.data.locationIds = params.locationIds;
  }
  if (params.annotationIds && params.annotationIds.length > 0) {
    payload.data.annotationIds = params.annotationIds;
  }
  if (params.userIds && params.userIds.length > 0) {
    payload.data.userIds = params.userIds;
  }
  if (params.statusIds && params.statusIds.length > 0) {
    payload.data.statusIds = params.statusIds;
  }
  if (params.groupByDocumentId !== undefined) {
    payload.data.groupByDocumentId = params.groupByDocumentId;
  }
  if (params.pageSize) {
    payload.data.pageSize = params.pageSize;
  }
  if (params.pageToken) {
    payload.data.pageToken = params.pageToken;
  }
  if (params.updatedAfter) {
    payload.data.updatedAfter = params.updatedAfter;
  }
  if (params.updatedBefore) {
    payload.data.updatedBefore = params.updatedBefore;
  }
  if (params.createdAfter) {
    payload.data.createdAfter = params.createdAfter;
  }
  if (params.createdBefore) {
    payload.data.createdBefore = params.createdBefore;
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
        `Failed to get comment annotations (${response.status})`,
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
      'Failed to get comment annotations',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Get comments within a specific comment annotation
 * 
 * @param params - Parameters for getting comments
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Get all comments in an annotation
 * const comments = await getComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789'
 * });
 * 
 * // Get specific comments by ID
 * const specific = await getComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789',
 *   commentIds: [12345, 67890]
 * });
 * ```
 */
export async function getComments(params: GetCommentsParams): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/comments/get`;

  const payload: any = {
    data: {
      organizationId: params.organizationId,
      documentId: params.documentId,
      annotationId: params.annotationId,
    },
  };

  // Add optional filters
  if (params.commentIds && params.commentIds.length > 0) {
    payload.data.commentIds = params.commentIds;
  }
  if (params.pageSize) {
    payload.data.pageSize = params.pageSize;
  }
  if (params.pageToken) {
    payload.data.pageToken = params.pageToken;
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
        `Failed to get comments (${response.status})`,
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
      'Failed to get comments',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}
