import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProblemStatement from "@/lib/models/ProblemStatement";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/problems/list
 * 
 * Returns all active problem statements grouped by track
 * Shows remaining slots for each problem
 * 
 * Query params (optional):
 * - track: filter by specific track
 * 
 * Response:
 * {
 *   "success": true,
 *   "problems": [
 *     {
 *       "_id": "...",
 *       "title": "...",
 *       "description": "...",
 *       "track": "...",
 *       "maxTeams": 10,
 *       "selectedCount": 3,
 *       "remainingSlots": 7,
 *       "isActive": true
 *     }
 *   ]
 * }
 */

type ProblemQuery = {
  isActive: boolean;
  track?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");

    await connectDB();

    // Build query
    const query: ProblemQuery = { isActive: true };
    if (track) {
      query.track = track;
    }

    // Fetch problems
    const problems = await ProblemStatement.find(query)
      .select("title description track maxTeams selectedCount isActive")
      .sort({ track: 1, title: 1 });

    // Add remaining slots
    const problemsWithSlots = problems.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      description: p.description,
      track: p.track,
      maxTeams: p.maxTeams,
      selectedCount: p.selectedCount,
      remainingSlots: Math.max(0, p.maxTeams - p.selectedCount),
      isActive: p.isActive,
    }));

    return NextResponse.json({
      success: true,
      problems: problemsWithSlots,
    });
  } catch (error) {
    console.error("Problem list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}
