import mongoose, { Schema, Document, Model } from "mongoose";

export interface User {
  phoneNo: string;
  email?: string;
  appointments: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & Document;

const userSchema = new Schema<User>(
  {
    phoneNo: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  },
  { timestamps: true }
);

const UserModel: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
