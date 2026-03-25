import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProblemStatement from "@/lib/models/ProblemStatement";
import Team from "@/lib/models/Team";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/problems
 * Fetch all problem statements
 */
export async function GET(req: NextRequest) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    try {
        await connectDB();
        const problems = await ProblemStatement.find({}).sort({ track: 1, title: 1 });
        
        // Fetch teams with custom problems (Student Innovation)
        const teamsWithCustom = await Team.find({ 
            customProblemStatement: { $ne: null } 
        }).select("teamId teamName customProblemStatement selectedAt");

        const customProblems = teamsWithCustom.map(t => ({
            _id: t._id,
            teamId: t.teamId,
            teamName: t.teamName,
            title: t.customProblemStatement?.title,
            description: t.customProblemStatement?.description,
            track: "Student Innovation",
            selectedAt: t.selectedAt,
            status: t.customProblemStatement?.status || "pending",
            isCustom: true
        }));

        return NextResponse.json({ success: true, problems, customProblems });
    } catch (error) {
        console.error("Fetch problems error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch problems" }, { status: 500 });
    }
}

/**
 * POST /api/admin/problems
 * Create a new problem statement
 */
export async function POST(req: NextRequest) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, track, maxTeams } = body;

        if (!title || !description || !track || !maxTeams) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const newProblem = new ProblemStatement({
            title,
            description,
            track,
            maxTeams,
            selectedTeams: [],
            isActive: true,
        });

        await newProblem.save();

        return NextResponse.json({
            success: true,
            message: "Problem statement created successfully",
            problem: newProblem,
        });
    } catch (error) {
        console.error("Create problem error:", error);
        return NextResponse.json({ success: false, message: "Failed to create problem statement" }, { status: 500 });
    }
}
