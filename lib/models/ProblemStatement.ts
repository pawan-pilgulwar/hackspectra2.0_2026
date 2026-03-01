import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProblemStatement extends Document {
  title: string;
  description: string;
  track: string;
  maxTeams: number;
  selectedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    selectedCount: {
      type: Number,
      default: 0,
      min: 0,
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

const ProblemStatement: Model<IProblemStatement> =
  mongoose.models.ProblemStatement ||
  mongoose.model<IProblemStatement>("ProblemStatement", ProblemStatementSchema);

export default ProblemStatement;
