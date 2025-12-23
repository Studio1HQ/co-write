import { VELT_CONFIG, getVeltHeaders, VeltApiError, VeltUser } from './config.js';

/**
 * Status object for comment annotations
 */
export interface VeltStatus {
  id: string;
  name: string;
  type: 'default' | 'ongoing' | 'terminal';
  color?: string;
  lightColor?: string;
  svg?: string;
  iconUrl?: string;
}

/**
 * Priority object for comment annotations
 */
export interface VeltPriority {
  id: string;
  name: string;
  color?: string;
  lightColor?: string;
}

/**
 * Location object for comment annotations
 */
export interface VeltLocation {
  id: string;
  locationName?: string;
}

/**
 * Target element for comment annotations
 */
export interface VeltTargetElement {
  elementId: string;
}

/**
 * Target text for comment annotations
 */
export interface VeltTargetText {
  text: string;
  occurrence?: number;
  selectAllContent?: boolean;
}

/**
 * Update data for comment annotations
 */
export interface CommentAnnotationUpdateData {
  location?: VeltLocation;
  targetElement?: VeltTargetElement;
  targetText?: VeltTargetText;
  from?: VeltUser;
  status?: VeltStatus;
  assignedTo?: VeltUser;
  context?: Record<string, any>;
  priority?: VeltPriority;
}

/**
 * Parameters for updating comment annotations
 */
export interface UpdateCommentAnnotationsParams {
  organizationId: string;
  documentId: string;
  annotationIds?: string[];
  locationIds?: string[];
  userIds?: string[];
  updatedData: CommentAnnotationUpdateData;
}

/**
 * Update data for comments
 */
export interface CommentUpdateData {
  commentText?: string;
  commentHtml?: string;
  context?: Record<string, any>;
  from?: VeltUser;
  taggedUserContacts?: VeltUser[];
}

/**
 * Parameters for updating comments
 */
export interface UpdateCommentsParams {
  organizationId: string;
  documentId: string;
  annotationId: string;
  commentIds: number[];
  updatedData: CommentUpdateData;
}

/**
 * Update comment annotations
 * 
 * @param params - Parameters for updating comment annotations
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Update annotation status
 * await updateCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationIds: ['annotation-1'],
 *   updatedData: {
 *     status: {
 *       id: 'IN_PROGRESS',
 *       name: 'In Progress',
 *       type: 'ongoing',
 *       color: '#FFA500'
 *     }
 *   }
 * });
 * 
 * // Update annotation context/metadata
 * await updateCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationIds: ['annotation-1'],
 *   updatedData: {
 *     context: {
 *       customField: 'customValue',
 *       taskId: 'TASK-123'
 *     }
 *   }
 * });
 * 
 * // Assign annotation to user
 * await updateCommentAnnotations({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationIds: ['annotation-1'],
 *   updatedData: {
 *     assignedTo: {
 *       userId: 'bob',
 *       name: 'Bob Smith',
 *       email: 'bob@example.com'
 *     }
 *   }
 * });
 * ```
 */
export async function updateCommentAnnotations(
  params: UpdateCommentAnnotationsParams
): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/update`;

  const payload: any = {
    data: {
      organizationId: params.organizationId,
      documentId: params.documentId,
      updatedData: params.updatedData,
    },
  };

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
        `Failed to update comment annotations (${response.status})`,
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
      'Failed to update comment annotations',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Update comments within a comment annotation
 * 
 * @param params - Parameters for updating comments
 * @returns Response from Velt API
 * 
 * @example
 * ```typescript
 * // Update comment text
 * await updateComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789',
 *   commentIds: [12345],
 *   updatedData: {
 *     commentText: 'Updated comment text'
 *   }
 * });
 * 
 * // Update comment with HTML and tags
 * await updateComments({
 *   organizationId: 'org-123',
 *   documentId: 'doc-456',
 *   annotationId: 'annotation-789',
 *   commentIds: [12345],
 *   updatedData: {
 *     commentText: 'Hey {{bob}}, check this out',
 *     commentHtml: '<p>Hey <span class="mention">{{bob}}</span>, check this out</p>',
 *     taggedUserContacts: [{
 *       userId: 'bob',
 *       name: 'Bob Smith',
 *       email: 'bob@example.com'
 *     }]
 *   }
 * });
 * ```
 */
export async function updateComments(params: UpdateCommentsParams): Promise<any> {
  const url = `${VELT_CONFIG.API_BASE_URL}/v2/commentannotations/comments/update`;

  const payload = {
    data: {
      organizationId: params.organizationId,
      documentId: params.documentId,
      annotationId: params.annotationId,
      commentIds: params.commentIds,
      updatedData: params.updatedData,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getVeltHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new VeltApiError(
        `Failed to update comments (${response.status})`,
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
      'Failed to update comments',
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}
