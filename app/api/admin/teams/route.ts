import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/teams
 * Fetch all teams
 */
export async function GET(req: NextRequest) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    try {
        await connectDB();
        const teams = await Team.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, teams });
    } catch (error) {
        console.error("Fetch teams error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch teams" }, { status: 500 });
    }
}

/**
 * POST /api/admin/teams
 * Create a new team
 */
export async function POST(req: NextRequest) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { teamId, teamName, leaderName, leaderEmail, teamMembers } = body;

        if (!teamId || !teamName || !leaderName || !leaderEmail) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Check if teamId or email already exists
        const existingTeam = await Team.findOne({
            $or: [{ teamId }, { leaderEmail }],
        });

        if (existingTeam) {
            return NextResponse.json(
                { success: false, message: "Team ID or Leader Email already registered" },
                { status: 400 }
            );
        }

        const newTeam = new Team({
            teamId,
            teamName,
            leaderName,
            leaderEmail,
            teamMembers: teamMembers || [],
        });

        await newTeam.save();

        return NextResponse.json({
            success: true,
            message: "Team created successfully",
            team: newTeam,
        });
    } catch (error) {
        console.error("Create team error:", error);
        return NextResponse.json({ success: false, message: "Failed to create team" }, { status: 500 });
    }
}
