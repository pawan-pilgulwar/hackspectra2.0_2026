import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // 7 days

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  console.error("CRITICAL: JWT_SECRET is not defined in environment variables!");
  throw new Error("JWT_SECRET must be defined in environment variables");
}

export interface JWTPayload {
  leaderEmail: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error("JWT generation error:", error);
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Set JWT cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("hackspectra_auth", token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/",
  });

  return response;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete("hackspectra_auth");
  return response;
}

/**
 * Get JWT payload from request cookies
 */
export function getAuthPayload(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get("hackspectra_auth")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Middleware helper to verify authentication
 * Returns payload if authenticated, null otherwise
 */
export function requireAuth(req: NextRequest): JWTPayload | null {
  return getAuthPayload(req);
}
