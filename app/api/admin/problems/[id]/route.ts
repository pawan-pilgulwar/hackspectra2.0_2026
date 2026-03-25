import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProblemStatement from "@/lib/models/ProblemStatement";
import Team from "@/lib/models/Team";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * PATCH /api/admin/problems/[id]
 * Update problem details
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    const { id } = params;

    try {
        const body = await req.json();
        const { title, description, track, maxTeams, isActive } = body;

        await connectDB();

        const problem = await ProblemStatement.findById(id);
        if (!problem) {
            return NextResponse.json({ success: false, message: "Problem not found" }, { status: 404 });
        }

        const oldTitle = problem.title;
        const oldTrack = problem.track;

        // Update fields
        if (title !== undefined) problem.title = title;
        if (description !== undefined) problem.description = description;
        if (track !== undefined) problem.track = track;
        if (maxTeams !== undefined) problem.maxTeams = maxTeams;
        if (isActive !== undefined) problem.isActive = isActive;

        await problem.save();

        // Sync: If title or track changed, update all teams that selected this problem
        if ((title && title !== oldTitle) || (track && track !== oldTrack)) {
            await Team.updateMany(
                { selectedProblemId: id },
                {
                    $set: {
                        "selectedProblem.problemTitle": problem.title,
                        "selectedProblem.problemTrack": problem.track
                    }
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Problem updated successfully",
            problem
        });
    } catch (error) {
        console.error("Update problem error:", error);
        return NextResponse.json({ success: false, message: "Failed to update problem" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/problems/[id]
 * Delete problem
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!(await verifyAdminSession(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized or session expired" }, { status: 401 });
    }

    const { id } = params;

    try {
        await connectDB();
        
        const problem = await ProblemStatement.findById(id);
        if (!problem) {
            return NextResponse.json({ success: false, message: "Problem not found" }, { status: 404 });
        }

        // Before deleting, find all teams that selected this problem and clear their selection
        await Team.updateMany(
            { selectedProblemId: id },
            {
                $set: {
                    selectedProblemId: null,
                    selectedProblem: null,
                    selectedTrack: null
                }
            }
        );

        await ProblemStatement.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Problem deleted successfully"
        });
    } catch (error) {
        console.error("Delete problem error:", error);
        return NextResponse.json({ success: false, message: "Failed to delete problem" }, { status: 500 });
    }
}
