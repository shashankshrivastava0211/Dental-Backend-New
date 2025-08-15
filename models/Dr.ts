import mongoose, { Schema, Document, Model } from "mongoose";

export interface WorkingHours {
  startTime: string;
  endTime: string;
  workingDays: string[];
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
  address?: string;
}

export interface Doctor {
  name: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating?: number;
  totalRatings?: number;
  availability: "Available" | "Busy" | "Unavailable" | "On Leave";
  workingHours: WorkingHours;
  location: LocationInfo;
  mobileNumber: string;
  email?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DoctorDocument = Doctor & Document;

const DrSchema = new Schema<Doctor>(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    consultationFee: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    availability: {
      type: String,
      required: true,
      enum: ["Available", "Busy", "Unavailable", "On Leave"],
    },
    workingHours: {
      startTime: { type: String, required: true, default: "09:00" },
      endTime: { type: String, required: true, default: "17:00" },
      workingDays: {
        type: [String],
        required: true,
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      address: { type: String, trim: true },
    },
    mobileNumber: { type: String, required: true, trim: true },
    email: { unique: true, type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DrSchema.index({ specialization: 1, location: 1, isActive: 1 } as any);

const DoctorModel: Model<DoctorDocument> =
  (mongoose.models.Doctor as Model<DoctorDocument>) ||
  mongoose.model<DoctorDocument>("Doctor", DrSchema);

export default DoctorModel;
