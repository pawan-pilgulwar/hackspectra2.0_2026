import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeam extends Document {
  teamId: string; // from Unstop
  teamName: string;
  leaderEmail: string;
  selectedTrack: string | null;
  selectedProblemId: string | null;
  customProblemStatement: {
    title: string;
    description: string;
  } | null;
  selectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

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
    leaderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
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
    customProblemStatement: {
      type: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
      default: null,
    },
    selectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
TeamSchema.index({ teamId: 1 });
TeamSchema.index({ leaderEmail: 1 });

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
