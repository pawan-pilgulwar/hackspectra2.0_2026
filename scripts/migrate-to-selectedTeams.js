/**
 * Migration Script: Convert selectedCount to selectedTeams array
 * 
 * This script migrates existing problem statements and teams to use the new
 * selectedTeams array-based approach instead of the old selectedCount field.
 * 
 * Run this script ONCE after deploying the new schema changes.
 * 
 * Usage:
 *   node scripts/migrate-to-selectedTeams.js
 * 
 * Or using MongoDB shell:
 *   mongosh < scripts/migrate-to-selectedTeams.js
 */

// MongoDB connection (update with your connection string)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hackspectra";

console.log("Starting migration to selectedTeams array...");
console.log("MongoDB URI:", MONGODB_URI);

// Step 1: Initialize selectedTeams array for all problems
console.log("\n[Step 1] Initializing selectedTeams array for all problems...");

db.problemstatements.updateMany(
  { selectedTeams: { $exists: false } },
  { $set: { selectedTeams: [] } }
);

const problemsInitialized = db.problemstatements.countDocuments({ selectedTeams: { $exists: true } });
console.log(`✓ Initialized selectedTeams for ${problemsInitialized} problems`);

// Step 2: Migrate team selections to selectedTeams array
console.log("\n[Step 2] Migrating team selections to selectedTeams array...");

let migratedCount = 0;
let skippedCount = 0;

db.teams.find({ selectedProblemId: { $ne: null, $exists: true } }).forEach(team => {
  const problemId = team.selectedProblemId;
  
  // Find the problem
  const problem = db.problemstatements.findOne({ _id: ObjectId(problemId) });
  
  if (!problem) {
    console.log(`⚠ Warning: Problem ${problemId} not found for team ${team.teamId}`);
    skippedCount++;
    return;
  }
  
  // Check if team is already in selectedTeams
  const alreadyExists = problem.selectedTeams && 
    problem.selectedTeams.some(t => t.teamId === team.teamId);
  
  if (alreadyExists) {
    console.log(`→ Team ${team.teamId} already in selectedTeams for problem ${problem.title}`);
    skippedCount++;
  } else {
    // Add team to problem's selectedTeams
    db.problemstatements.updateOne(
      { _id: problem._id },
      {
        $push: {
          selectedTeams: {
            teamId: team.teamId,
            teamName: team.teamName
          }
        }
      }
    );
    
    console.log(`✓ Added team ${team.teamId} to problem "${problem.title}"`);
    migratedCount++;
  }
  
  // Add selectedProblem object to team if not exists
  if (!team.selectedProblem) {
    db.teams.updateOne(
      { _id: team._id },
      {
        $set: {
          selectedProblem: {
            problemId: problemId,
            problemTitle: problem.title,
            problemTrack: problem.track
          }
        }
      }
    );
    
    console.log(`✓ Added selectedProblem to team ${team.teamId}`);
  }
});

console.log(`\n✓ Migrated ${migratedCount} team selections`);
console.log(`→ Skipped ${skippedCount} already migrated selections`);

// Step 3: Verify data integrity
console.log("\n[Step 3] Verifying data integrity...");

const problems = db.problemstatements.find({}).toArray();
let integrityIssues = 0;

problems.forEach(problem => {
  const selectedCount = problem.selectedTeams ? problem.selectedTeams.length : 0;
  const maxTeams = problem.maxTeams;
  
  if (selectedCount > maxTeams) {
    console.log(`⚠ ERROR: Problem "${problem.title}" has ${selectedCount} teams but maxTeams is ${maxTeams}`);
    integrityIssues++;
  }
  
  // Check for duplicate teams
  if (problem.selectedTeams) {
    const teamIds = problem.selectedTeams.map(t => t.teamId);
    const uniqueTeamIds = [...new Set(teamIds)];
    
    if (teamIds.length !== uniqueTeamIds.length) {
      console.log(`⚠ ERROR: Problem "${problem.title}" has duplicate team entries`);
      integrityIssues++;
    }
  }
});

if (integrityIssues === 0) {
  console.log("✓ All problems have valid selectedTeams arrays");
} else {
  console.log(`⚠ Found ${integrityIssues} integrity issues - please review`);
}

// Step 4: Remove old selectedCount field (optional - can be done later)
console.log("\n[Step 4] Removing old selectedCount field...");

const removeResult = db.problemstatements.updateMany(
  { selectedCount: { $exists: true } },
  { $unset: { selectedCount: "" } }
);

console.log(`✓ Removed selectedCount from ${removeResult.modifiedCount} problems`);

// Step 5: Generate migration report
console.log("\n[Step 5] Migration Report");
console.log("═══════════════════════════════════════");

const totalProblems = db.problemstatements.countDocuments({});
const totalTeams = db.teams.countDocuments({});
const teamsWithSelections = db.teams.countDocuments({ selectedProblem: { $ne: null } });

console.log(`Total Problems: ${totalProblems}`);
console.log(`Total Teams: ${totalTeams}`);
console.log(`Teams with Selections: ${teamsWithSelections}`);

console.log("\nProblem Statement Summary:");
db.problemstatements.aggregate([
  {
    $project: {
      title: 1,
      track: 1,
      maxTeams: 1,
      selectedCount: { $size: "$selectedTeams" },
      remainingSlots: { $subtract: ["$maxTeams", { $size: "$selectedTeams" }] }
    }
  },
  { $sort: { track: 1, title: 1 } }
]).forEach(problem => {
  console.log(`  ${problem.track} - ${problem.title}: ${problem.selectedCount}/${problem.maxTeams} (${problem.remainingSlots} remaining)`);
});

console.log("\n✓ Migration completed successfully!");
console.log("\nNext steps:");
console.log("1. Verify the migration report above");
console.log("2. Test problem selection in the application");
console.log("3. Deploy the updated code to production");
console.log("4. Monitor for any issues");
