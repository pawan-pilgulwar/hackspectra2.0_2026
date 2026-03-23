import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Helper to verify admin cookie
 */
async function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("hackspectra_admin_auth")?.value;
    if (!token) return false;

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) return false;

        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        return !!(decoded && decoded.admin === true);
    } catch (error) {
        console.log("Verify admin error:", error);
        return false;
    }
}

/**
 * PATCH /api/admin/teams/[id]
 * Update team details
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        const body = await req.json();
        const { 
            teamName, 
            leaderName, 
            leaderEmail, 
            teamMembers, 
            selectedProblemId,
            approveCustomProblem,
            rejectCustomProblem,
            rejectionMessage
        } = body;

        await connectDB();

        const team = await Team.findById(id);
        if (!team) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        // Handle Custom Problem Approval
        if (approveCustomProblem) {
            if (team.customProblemStatement) {
                team.customProblemStatement.status = "approved";
                team.isCustomProblemRejected = false;
                team.rejectionMessage = null;
                await team.save();
                return NextResponse.json({ success: true, message: "Custom problem approved! 🛡️", team });
            }
        }

        // Handle Custom Problem Rejection
        if (rejectCustomProblem) {
            const oldProblemId = team.selectedProblemId;

            // 1. Full Cleanup of Team Document
            team.customProblemStatement = null;
            team.selectedTrack = null;
            team.selectedProblemId = null;
            team.selectedProblem = null;
            team.selectedAt = null;
            team.isCustomProblemRejected = true;
            team.rejectionMessage = rejectionMessage || "Your custom problem was not approved. Please select another problem.";
            
            // 2. Ensure removal from any ProblemStatement collections
            if (oldProblemId) {
                await ProblemStatement.findOneAndUpdate(
                    { _id: oldProblemId },
                    { $pull: { selectedTeams: { teamId: team.teamId } } }
                );
            }

            // Also search for team in ALL problems just in case of multiple references
            await ProblemStatement.updateMany(
                { "selectedTeams.teamId": team.teamId },
                { $pull: { selectedTeams: { teamId: team.teamId } } }
            );

            await team.save();
            
            return NextResponse.json({
                success: true,
                message: "Custom problem rejected and selection cleared. Team can now reselect. 🔴",
                team
            });
        }

        const oldProblemId = team.selectedProblemId;
        const oldTeamName = team.teamName;

        // 1. Handle Problem Selection Change
        if (selectedProblemId !== undefined && selectedProblemId !== oldProblemId) {
            // Remove from old problem
            if (oldProblemId) {
                await ProblemStatement.findOneAndUpdate(
                    { _id: oldProblemId },
                    { $pull: { selectedTeams: { teamId: team.teamId } } }
                );
            }

            // Add to new problem
            if (selectedProblemId) {
                const newProblem = await ProblemStatement.findById(selectedProblemId);
                if (!newProblem) {
                    return NextResponse.json({ success: false, message: "New problem not found" }, { status: 404 });
                }

                // Check slots
                if (newProblem.selectedTeams.length >= newProblem.maxTeams) {
                    return NextResponse.json({ success: false, message: "Selected problem is already full" }, { status: 400 });
                }

                await ProblemStatement.findByIdAndUpdate(selectedProblemId, {
                    $addToSet: { 
                        selectedTeams: { 
                            teamId: team.teamId, 
                            teamName: teamName || team.teamName 
                        } 
                    }
                });

                team.selectedProblemId = selectedProblemId;
                team.selectedProblem = {
                    problemId: newProblem._id.toString(),
                    problemTitle: newProblem.title,
                    problemDescription: newProblem.description,
                    problemTrack: newProblem.track
                };
            } else {
                team.selectedProblemId = null;
                team.selectedProblem = null;
            }
        } else if (teamName && teamName !== oldTeamName && team.selectedProblemId) {
            // Team name changed, update it in the selected problem's list
            await ProblemStatement.findOneAndUpdate(
                { _id: team.selectedProblemId, "selectedTeams.teamId": team.teamId },
                { $set: { "selectedTeams.$.teamName": teamName } }
            );
        }

        // 2. Update basic info
        if (teamName) team.teamName = teamName;
        if (leaderName) team.leaderName = leaderName;
        if (leaderEmail) team.leaderEmail = leaderEmail;
        if (teamMembers) team.teamMembers = teamMembers;

        await team.save();

        return NextResponse.json({
            success: true,
            message: "Team updated successfully",
            team
        });
    } catch (error) {
        console.error("Update team error:", error);
        return NextResponse.json({ success: false, message: "Failed to update team" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/teams/[id]
 * Delete team
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        await connectDB();
        const team = await Team.findById(id);
        if (!team) {
            return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
        }

        // Sync: Remove from problem if selected
        if (team.selectedProblemId) {
            await ProblemStatement.findOneAndUpdate(
                { _id: team.selectedProblemId },
                { $pull: { selectedTeams: { teamId: team.teamId } } }
            );
        }

        await Team.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Team deleted successfully"
        });
    } catch (error) {
        console.error("Delete team error:", error);
        return NextResponse.json({ success: false, message: "Failed to delete team" }, { status: 500 });
    }
}
