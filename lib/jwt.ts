import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "hackspectra-secret-key-change-in-production";
const JWT_EXPIRES_IN = "1d"; // 1 days

export interface JWTPayload {
  teamId: string;
  leaderEmail: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
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
    secure: isProduction,
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
