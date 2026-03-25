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

    // Find team using JWT payload (email and session)
    const team = await Team.findOne({ 
      leaderEmail: payload.leaderEmail,
    });
    
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Validate active session
    if (team.activeSessionId !== payload.sessionId) {
      return NextResponse.json(
        { success: false, message: "Session expired. Another login detected.", code: "SESSION_EXPIRED" },
        { status: 401 }
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
    // START TRANSACTION: Ensure atomicity across collections
    // ═══════════════════════════════════════════════════════════════
    const mongoose = (await import("mongoose")).default;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Update ProblemStatement (Atomic push with condition)
      const updatedProblem = await ProblemStatement.findOneAndUpdate(
        {
          _id: problemId,
          isActive: true,
          $expr: { $lt: [{ $size: "$selectedTeams" }, "$maxTeams"] },
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
          session, // Use the transaction session
        }
      );

      if (!updatedProblem) {
        throw new Error("PROBLEM_FULL_OR_CONFLICT");
      }

      // 2. Update Team
      const updatedTeam = await Team.findOneAndUpdate(
        { 
          _id: team._id,
          // Extra safety: ensure team hasn't selected anything yet (double check)
          selectedProblem: null,
          customProblemStatement: null 
        },
        {
          selectedTrack: problem.track,
          selectedProblemId: problemId,
          selectedProblem: {
            problemId: problemId,
            problemTitle: problem.title,
            problemDescription: problem.description,
            problemTrack: problem.track,
          },
          selectedAt: new Date(),
        },
        { 
          new: true,
          session, // Use the transaction session
        }
      );

      if (!updatedTeam) {
        throw new Error("TEAM_ALREADY_SELECTED_OR_NOT_FOUND");
      }

      // 3. Commit Transaction
      await session.commitTransaction();

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
    } catch (txError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = txError as any;
      // 4. Abort Transaction on error
      await session.abortTransaction();
      
      console.error("Selection transaction failed:", error);

      if (error.message === "PROBLEM_FULL_OR_CONFLICT") {
        return NextResponse.json(
          { success: false, message: "Problem statement became full or selection conflict occurred." },
          { status: 409 }
        );
      }

      if (error.message === "TEAM_ALREADY_SELECTED_OR_NOT_FOUND") {
        return NextResponse.json(
          { success: false, message: "Team has already made a selection or team not found." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Failed to complete selection. Please try again." },
        { status: 500 }
      );
      // 5. End Session
      await session.endSession();
    }
  } catch (error) {
    console.error("Problem selection error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to select problem" },
      { status: 500 }
    );
  }
}
