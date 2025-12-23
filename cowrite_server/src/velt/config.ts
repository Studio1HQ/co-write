/**
 * Velt API Configuration
 * Centralized configuration for Velt REST API integration
 */

export const VELT_CONFIG = {
  API_KEY: process.env.VELT_API_KEY || 'hnbXx3OVUnYwsPsmATqe',
  AUTH_TOKEN: process.env.VELT_AUTH_TOKEN || 'c07ff1a0da2a3c14a9f60b41042b0628',
  API_BASE_URL: "https://api.velt.dev",
  ORGANIZATION_ID: "syncboard-org-prod",
  DOCUMENT_ID: "syncboard-whiteboard-prod",
} as const;

export interface VeltUser {
  userId: string;
  name: string;
  email?: string;
}

export interface VeltApiHeaders {
  "Content-Type": string;
  "x-velt-api-key": string;
  "x-velt-auth-token": string;
  [key: string]: string;
}

export function getVeltHeaders(): VeltApiHeaders {
  if (!VELT_CONFIG.AUTH_TOKEN) {
    console.warn(
      "⚠️ VELT_AUTH_TOKEN not set. Get it from https://console.velt.dev → Auth Token section"
    );
  }

  return {
    "Content-Type": "application/json",
    "x-velt-api-key": VELT_CONFIG.API_KEY,
    "x-velt-auth-token": VELT_CONFIG.AUTH_TOKEN,
  };
}

export class VeltApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: string
  ) {
    super(message);
    this.name = "VeltApiError";
  }
}
