import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminSession extends Document {
  activeSessionId: string;
  updatedAt: Date;
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    activeSessionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession || mongoose.model<IAdminSession>("AdminSession", AdminSessionSchema);

export default AdminSession;
