import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/verify
 * 
 * Verifies if the current admin session is valid and active.
 * Used for single active login enforcement.
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await verifyAdminSession(req);

        if (!payload) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Session expired or logged in from another device.",
                    code: "SESSION_INVALID"
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Admin session is active",
            role: payload.role
        });
    } catch (error) {
        console.error("Admin verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
