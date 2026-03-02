import mongoose, { Schema, Document, Model } from "mongoose";

// Sub-schema for selected teams
interface ISelectedTeam {
  teamId: string;
  teamName: string;
}

export interface IProblemStatement extends Document {
  title: string;
  description: string;
  track: string;
  maxTeams: number;
  selectedTeams: ISelectedTeam[]; // Array of teams that selected this problem
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SelectedTeamSchema = new Schema<ISelectedTeam>(
  {
    teamId: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Don't create _id for subdocuments
);

const ProblemStatementSchema = new Schema<IProblemStatement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    track: {
      type: String,
      required: true,
      enum: [
        "Agriculture",
        "Healthcare",
        "Education",
        "Smart City",
        "Disaster Management",
        "Cybersecurity",
        "Transportation & Tourism",
        "Women & Child Development",
        // Note: "Student Innovation" does NOT have predefined problem statements
      ],
    },
    maxTeams: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedTeams: {
      type: [SelectedTeamSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProblemStatementSchema.index({ track: 1, isActive: 1 });
ProblemStatementSchema.index({ isActive: 1 });
ProblemStatementSchema.index({ "selectedTeams.teamId": 1 }); // For quick duplicate checks

// Virtual field for remaining slots (computed on-the-fly)
ProblemStatementSchema.virtual("remainingSlots").get(function (this: IProblemStatement) {
  return Math.max(0, this.maxTeams - this.selectedTeams.length);
});

// Virtual field for selected count (computed on-the-fly)
ProblemStatementSchema.virtual("selectedCount").get(function (this: IProblemStatement) {
  return this.selectedTeams.length;
});

// Ensure virtuals are included in JSON output
ProblemStatementSchema.set("toJSON", { virtuals: true });
ProblemStatementSchema.set("toObject", { virtuals: true });

const ProblemStatement: Model<IProblemStatement> =
  mongoose.models.ProblemStatement ||
  mongoose.model<IProblemStatement>("ProblemStatement", ProblemStatementSchema);

export default ProblemStatement;
