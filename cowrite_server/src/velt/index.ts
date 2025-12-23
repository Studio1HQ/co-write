/**
 * Velt API Integration
 * Main export file for all Velt API functions
 */

// Configuration
export { VELT_CONFIG, getVeltHeaders, VeltApiError } from "./config.js";
export type { VeltUser, VeltApiHeaders } from "./config.js";

// Comment Annotations
export { addCommentAnnotation, processMentions } from "./commentAnnotations.js";
export type {
  CommentAnnotationLocation,
  TargetElement,
  TargetText,
  CommentData,
  AddCommentAnnotationParams,
} from "./commentAnnotations.js";

// Comments and Replies
export { addComment, addReply } from "./comments.js";
export type { AddCommentParams, AddReplyParams } from "./comments.js";

// Get Comments
export { getCommentAnnotations, getComments } from "./getComments.js";
export type {
  GetCommentAnnotationsParams,
  GetCommentsParams,
} from "./getComments.js";

// Update Comments
export { updateCommentAnnotations, updateComments } from "./updateComment.js";
export type {
  UpdateCommentAnnotationsParams,
  UpdateCommentsParams,
  CommentAnnotationUpdateData,
  CommentUpdateData,
  VeltStatus,
  VeltPriority,
  VeltLocation,
  VeltTargetElement,
  VeltTargetText,
} from "./updateComment.js";

// Delete Comments
export { deleteCommentAnnotations, deleteComments } from "./deleteComment.js";
export type {
  DeleteCommentAnnotationsParams,
  DeleteCommentsParams,
} from "./deleteComment.js";
