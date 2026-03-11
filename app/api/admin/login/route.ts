import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/login
 * 
 * Verifies admin password and sets an admin auth cookie
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password } = body;

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error("ADMIN_PASSWORD is not defined in environment variables");
            return NextResponse.json(
                { success: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, message: "Invalid admin password" },
                { status: 401 }
            );
        }

        // Generate a simple admin-specific JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            { role: "admin", admin: true },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Admin login successful",
        });

        // We can reuse setAuthCookie but maybe we want a different cookie name for admin
        // To keep it simple and follow instructions, I'll use a specific cookie if needed
        // or just use the same helper if it's flexible enough.
        // Actually, let's define a specific admin cookie setter here or in jwt.ts.

        response.cookies.set("hackspectra_admin_auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to login as admin" },
            { status: 500 }
        );
    }
}
