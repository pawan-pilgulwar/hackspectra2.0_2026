import mongoose, { Schema, Document, Model } from "mongoose";

// Sub-schema for selected problem details
interface ISelectedProblem {
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  problemTrack: string;
}

export interface ITeam extends Document {
  teamId: string; // from Unstop
  teamName: string;
  leaderName: string; // Team leader's full name
  leaderEmail: string;
  teamMembers: string[]; // Array of team member names
  selectedTrack: string | null;
  selectedProblemId: string | null; // Kept for backward compatibility
  selectedProblem: ISelectedProblem | null; // NEW: Full problem details
  customProblemStatement: {
    title: string;
    description: string;
    status?: "pending" | "approved" | "rejected";
  } | null;
  rejectionMessage: string | null;
  isCustomProblemRejected: boolean;
  selectedAt: Date | null;
  activeSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const SelectedProblemSchema = new Schema<ISelectedProblem>(
  {
    problemId: {
      type: String,
      required: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    problemDescription: {
      type: String,
      required: true,
    },
    problemTrack: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Don't create _id for subdocuments
);

const TeamSchema = new Schema<ITeam>(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // Email-only authentication requires unique emails
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    selectedTrack: {
      type: String,
      default: null,
      enum: [
        null,
        "Agriculture",
        "Healthcare",
        "Education",
        "Smart City",
        "Disaster Management",
        "Cybersecurity",
        "Transportation & Tourism",
        "Women & Child Development",
        "Student Innovation",
      ],
    },
    selectedProblemId: {
      type: String,
      default: null,
    },
    selectedProblem: {
      type: SelectedProblemSchema,
      default: null,
    },
    customProblemStatement: {
      type: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { 
          type: String, 
          enum: ["pending", "approved", "rejected"], 
          default: "pending" 
        }
      },
      default: null,
    },
    rejectionMessage: {
      type: String,
      default: null,
    },
    isCustomProblemRejected: {
      type: Boolean,
      default: false,
    },
    selectedAt: {
      type: Date,
      default: null,
    },
    activeSessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
// Note: teamId and leaderEmail already have unique indexes from schema definition
// No additional indexes needed

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
