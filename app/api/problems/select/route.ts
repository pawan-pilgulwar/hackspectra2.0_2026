import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { requireAuth } from "@/lib/jwt";

/**
 * POST /api/problems/select
 * 
 * Allows a team to select a predefined problem statement
 * (For NON-Student Innovation tracks)
 * Requires JWT authentication
 * 
 * Request body:
 * {
 *   "problemId": "string"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Problem selected successfully"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // FIX ISSUE 2: Verify JWT authentication
    const payload = requireAuth(req);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { problemId } = body;

    // Validation
    if (!problemId) {
      return NextResponse.json(
        { success: false, message: "Problem ID is required" },
        { status: 400 }
      );
    }

    // Check hackathon phase
    const phase = process.env.HACKATHON_PHASE;
    if (phase !== "PROBLEM_SELECTION") {
      return NextResponse.json(
        { success: false, message: "Problem selection is not currently open" },
        { status: 403 }
      );
    }

    await connectDB();

    // Find team using JWT payload
    const team = await Team.findOne({ 
      teamId: payload.teamId,
      leaderEmail: payload.leaderEmail,
    });
    
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Check if team already selected
    if (team.selectedProblemId || team.customProblemStatement) {
      return NextResponse.json(
        { success: false, message: "Team has already made a selection" },
        { status: 400 }
      );
    }

    // Find problem statement
    const problem = await ProblemStatement.findById(problemId);
    if (!problem) {
      return NextResponse.json(
        { success: false, message: "Problem statement not found" },
        { status: 404 }
      );
    }

    if (!problem.isActive) {
      return NextResponse.json(
        { success: false, message: "This problem statement is no longer active" },
        { status: 400 }
      );
    }

    // Check if problem is full
    if (problem.selectedCount >= problem.maxTeams) {
      return NextResponse.json(
        { success: false, message: "This problem statement is full" },
        { status: 400 }
      );
    }

    // Atomic update: increment selectedCount only if not full
    const updatedProblem = await ProblemStatement.findOneAndUpdate(
      {
        _id: problemId,
        selectedCount: { $lt: problem.maxTeams },
        isActive: true,
      },
      {
        $inc: { selectedCount: 1 },
      },
      { new: true }
    );

    if (!updatedProblem) {
      return NextResponse.json(
        { success: false, message: "Problem statement became full. Please select another." },
        { status: 409 }
      );
    }

    // Update team
    team.selectedTrack = problem.track;
    team.selectedProblemId = problemId;
    team.selectedAt = new Date();
    await team.save();

    return NextResponse.json({
      success: true,
      message: "Problem selected successfully",
      data: {
        track: problem.track,
        problemTitle: problem.title,
        problemDescription: problem.description,
      },
    });
  } catch (error) {
    console.error("Problem selection error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to select problem" },
      { status: 500 }
    );
  }
}
