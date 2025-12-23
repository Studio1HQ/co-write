# Velt API Integration

This folder contains modular helper functions for integrating with Velt's REST API v2.

## Structure

```
velt/
├── config.ts              # API configuration and headers
├── comments.ts            # Add comments and replies
├── commentAnnotations.ts  # Add comment annotations with targeting
├── getComments.ts         # Retrieve comment annotations and comments
├── updateComment.ts       # Update comment annotations and comments
├── deleteComment.ts       # Delete comment annotations and comments
└── index.ts              # Main export file
```

## Files Overview

### `config.ts`
Centralized configuration for Velt API:
- API keys and auth tokens
- Base URL configuration
- Header generation
- Error handling classes

### `comments.ts`
Simple comment and reply operations:
- `addComment()` - Add a comment to the document
- `addReply()` - Reply to an existing comment thread

### `commentAnnotations.ts`
Advanced comment annotations with targeting:
- `addCommentAnnotation()` - Add comments at specific locations
- Supports three targeting modes:
  1. **Location-based**: Target by location ID
  2. **Element-based**: Target specific DOM elements or shapes
  3. **Text-based**: Target specific text content

### `getComments.ts`
Retrieve comment data:
- `getCommentAnnotations()` - Get all annotations with optional filtering
- `getComments()` - Get comments within a specific annotation

### `updateComment.ts`
Update existing comments:
- `updateCommentAnnotations()` - Update annotation properties (status, priority, context)
- `updateComments()` - Update comment text or metadata

### `deleteComment.ts`
Delete comments and annotations:
- `deleteCommentAnnotations()` - Delete annotations by ID, location, or user
- `deleteComments()` - Delete specific comments within an annotation

Here's a shortened, clearer version with the Velt v4 SDK requirement prominently mentioned:

***

## ⚠️ Important Prerequisites

**Prior to using the advanced features** (get, update, delete comments/annotations), you must:

1. **Deploy v4 series of the Velt SDK** in your application
2. **Enable advanced queries** in [Velt Console](https://console.velt.dev/dashboard/config/appconfig) → App Config

Without these, only `addComment()` and `addCommentAnnotation()` will work. Advanced query operations will fail.

## Usage Examples

### Adding a Simple Comment

```typescript
import { addComment } from "./velt/index.js";

await addComment({
  commentText: "Great work on this!",
  fromUser: {
    userId: "bob",
    name: "Bob Smith",
    email: "bob@example.com"
  },
  targetUser: "@alice" // Optional: mention another user
});
```


## Configuration

Set environment variables in `.env`:

```bash
VELT_API_KEY=your_api_key_here
VELT_AUTH_TOKEN=your_auth_token_here
```

Get your auth token from: https://console.velt.dev → Auth Token section

## Error Handling

All functions throw `VeltApiError` on failure:

```typescript
try {
  await addComment({...});
} catch (error) {
  if (error instanceof VeltApiError) {
    console.error('Velt API Error:', error.statusCode, error.response);
  }
}
```
## API Documentation

Full Velt API documentation: https://docs.velt.dev/api-reference/rest-apis/v2/comments-feature/
