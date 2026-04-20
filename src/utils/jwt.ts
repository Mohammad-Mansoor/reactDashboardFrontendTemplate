/**
 * JWT UTILITY
 * 
 * Lightweight utility to decode JWT payloads without external dependencies.
 */

export interface JwtPayload {
  userId: string;
  sessionId: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the payload.
 * Returns null if the token is invalid or cannot be parsed.
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[JWT] Failed to decode token:', error);
    return null;
  }
};
