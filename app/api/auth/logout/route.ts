import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * 
 * Logout endpoint - clears JWT cookie
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  return clearAuthCookie(response);
}
