import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { generateToken, setAuthCookie } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose and jsonwebtoken)
export const runtime = 'nodejs';

/**
 * POST /api/auth/verify
 * 
 * Authentication endpoint with JWT (Email-Only Authentication)
 * Validates team using Team Leader Email ONLY
 * Returns JWT in HTTP-only cookie
 * 
 * Request body:
 * {
 *   "leaderEmail": "string"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "team": { 
 *     teamId, teamName, leaderName, leaderEmail, teamMembers,
 *     selectedTrack, selectedProblemId, selectedProblem (populated), 
 *     customProblemStatement 
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leaderEmail } = body;

    // Validation
    if (!leaderEmail) {
      return NextResponse.json(
        { success: false, message: "Leader Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection error" },
        { status: 500 }
      );
    }

    // Find team by email only
    const team = await Team.findOne({
      leaderEmail: leaderEmail.trim().toLowerCase(),
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Invalid Leader Email. Please check your email or register first." },
        { status: 401 }
      );
    }

    // FIX ISSUE 1: Populate selected problem details if exists
    let selectedProblem = null;
    if (team.selectedProblem) {
      // Use the embedded selectedProblem data
      selectedProblem = {
        _id: team.selectedProblem.problemId,
        title: team.selectedProblem.problemTitle,
        track: team.selectedProblem.problemTrack,
      };
    } else if (team.selectedProblemId) {
      // Fallback: Fetch from database if only ID exists (backward compatibility)
      try {
        const problem = await ProblemStatement.findById(team.selectedProblemId);
        if (problem) {
          selectedProblem = {
            _id: problem._id.toString(),
            title: problem.title,
            track: problem.track,
          };
        }
      } catch (problemError) {
        console.error("Error fetching problem details:", problemError);
        // Continue without problem details
      }
    }

    // FIX ISSUE 2: Generate JWT token (email-only)
    let token;
    try {
      token = generateToken({
        leaderEmail: team.leaderEmail,
      });
    } catch (jwtError) {
      console.error("JWT generation failed:", jwtError);
      return NextResponse.json(
        { success: false, message: "Authentication token generation failed" },
        { status: 500 }
      );
    }

    // Create response with team data
    const response = NextResponse.json({
      success: true,
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        teamMembers: team.teamMembers,
        selectedTrack: team.selectedTrack,
        selectedProblemId: team.selectedProblemId,
        selectedProblem: selectedProblem, // NEW: Full problem details
        customProblemStatement: team.customProblemStatement,
        selectedAt: team.selectedAt,
      },
    });

    // FIX ISSUE 2: Set JWT in HTTP-only cookie
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
