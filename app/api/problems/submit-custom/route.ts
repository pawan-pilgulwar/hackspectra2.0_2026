import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import { requireAuth } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose and jsonwebtoken)
export const runtime = 'nodejs';

/**
 * POST /api/problems/submit-custom
 * 
 * Allows a team to submit a custom problem statement
 * (For Student Innovation track ONLY)
 * Requires JWT authentication
 * 
 * Request body:
 * {
 *   "title": "string",
 *   "description": "string"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Custom problem submitted successfully"
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
    const { title, description } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    if (title.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (description.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: "Description must be at least 20 characters" },
        { status: 400 }
      );
    }

    // Check hackathon phase
    const phase = process.env.HACKATHON_PHASE;
    if (phase !== "PROBLEM_SELECTION") {
      return NextResponse.json(
        { success: false, message: "Problem submission is not currently open" },
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

    // Check if team already selected
    if (team.selectedProblemId || team.customProblemStatement) {
      return NextResponse.json(
        { success: false, message: "Team has already made a selection" },
        { status: 400 }
      );
    }

    // Update team with custom problem
    team.selectedTrack = "Student Innovation";
    team.customProblemStatement = {
      title: title.trim(),
      description: description.trim(),
      status: "pending",
    };
    team.isCustomProblemRejected = false;
    team.rejectionMessage = null;
    team.selectedAt = new Date();
    await team.save();

    return NextResponse.json({
      success: true,
      message: "Custom problem submitted successfully",
      data: {
        track: "Student Innovation",
        problemTitle: title.trim(),
      },
    });
  } catch (error) {
    console.error("Custom problem submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit custom problem" },
      { status: 500 }
    );
  }
}
