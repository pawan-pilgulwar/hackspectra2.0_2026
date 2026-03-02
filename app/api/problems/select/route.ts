import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { requireAuth } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose and jsonwebtoken)
export const runtime = 'nodejs';

/**
 * POST /api/problems/select
 * 
 * Allows a team to select a predefined problem statement
 * (For NON-Student Innovation tracks)
 * Requires JWT authentication
 * 
 * ENFORCES:
 * 1. Team can only select ONE problem (checked via selectedProblem/customProblemStatement)
 * 2. Problem team limit strictly enforced (selectedTeams.length < maxTeams)
 * 3. No duplicate team selections
 * 4. Atomic updates to prevent race conditions
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
    // Verify JWT authentication
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

    // Find team using JWT payload (email only)
    const team = await Team.findOne({ 
      leaderEmail: payload.leaderEmail,
    });
    
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // CHECK 1: Verify team has NOT already selected any problem
    // ═══════════════════════════════════════════════════════════════
    if (team.selectedProblem || team.customProblemStatement) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Team has already made a selection. Each team can only select one problem statement." 
        },
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

    // ═══════════════════════════════════════════════════════════════
    // CHECK 2: Verify problem has NOT reached team limit
    // ═══════════════════════════════════════════════════════════════
    if (problem.selectedTeams.length >= problem.maxTeams) {
      return NextResponse.json(
        { 
          success: false, 
          message: `This problem statement is full. Maximum ${problem.maxTeams} teams allowed.` 
        },
        { status: 400 }
      );
    }

    // Check if this team is already in selectedTeams (duplicate prevention)
    const alreadySelected = problem.selectedTeams.some(
      (selectedTeam) => selectedTeam.teamId === team.teamId
    );

    if (alreadySelected) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This team has already selected this problem statement." 
        },
        { status: 400 }
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // ATOMIC UPDATE: Add team to problem's selectedTeams
    // ═══════════════════════════════════════════════════════════════
    // Use $push with $position to add team, but only if:
    // - selectedTeams array length is still less than maxTeams
    // - This team is not already in the array
    const updatedProblem = await ProblemStatement.findOneAndUpdate(
      {
        _id: problemId,
        isActive: true,
        // Ensure we haven't exceeded limit (atomic check)
        $expr: { $lt: [{ $size: "$selectedTeams" }, "$maxTeams"] },
        // Ensure this team isn't already in the array
        "selectedTeams.teamId": { $ne: team.teamId },
      },
      {
        $push: {
          selectedTeams: {
            teamId: team.teamId,
            teamName: team.teamName,
          },
        },
      },
      { 
        new: true,
        runValidators: true, // Run schema validators
      }
    );

    // If update failed, problem became full or team was already added
    if (!updatedProblem) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Problem statement became full or selection conflict occurred. Please try another problem." 
        },
        { status: 409 }
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // UPDATE TEAM: Store selected problem details
    // ═══════════════════════════════════════════════════════════════
    try {
      team.selectedTrack = problem.track;
      team.selectedProblemId = problemId; // Backward compatibility
      team.selectedProblem = {
        problemId: problemId,
        problemTitle: problem.title,
        problemTrack: problem.track,
      };
      team.selectedAt = new Date();
      await team.save();
    } catch (teamUpdateError) {
      // If team update fails, rollback problem update
      console.error("Team update failed, rolling back problem update:", teamUpdateError);
      
      await ProblemStatement.findByIdAndUpdate(
        problemId,
        {
          $pull: {
            selectedTeams: { teamId: team.teamId },
          },
        }
      );

      return NextResponse.json(
        { success: false, message: "Failed to complete selection. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Problem selected successfully",
      data: {
        track: problem.track,
        problemTitle: problem.title,
        problemDescription: problem.description,
        remainingSlots: updatedProblem.maxTeams - updatedProblem.selectedTeams.length,
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
