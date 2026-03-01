import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";

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
