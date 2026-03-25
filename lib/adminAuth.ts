import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "./mongodb";
import AdminSession from "./models/AdminSession";

export interface AdminPayload {
    role: string;
    admin: boolean;
    sessionId: string;
}

/**
 * Verifies if the request has a valid admin session
 * Returns the decoded payload if valid, null otherwise
 */
export async function verifyAdminSession(req: NextRequest): Promise<AdminPayload | null> {
    const token = req.cookies.get("hackspectra_admin_auth")?.value;
    if (!token) return null;

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET NOT CONFIGURED");
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
        
        if (!decoded || decoded.role !== "admin" || !decoded.sessionId) {
            return null;
        }

        // Connect to DB to check active session
        await connectDB();
        const session = await AdminSession.findOne({});
        
        // If no session exists or ID mismatch, it's invalid
        if (!session || session.activeSessionId !== decoded.sessionId) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Admin session verification error:", error);
        return null;
    }
}
