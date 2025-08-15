import mongoose, { Schema, Document, Model } from "mongoose";

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}
export interface ProcedureItem {
  procedureName: string;
  notes?: string;
}

export interface Prescription {
  doctorId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  medicines: MedicineItem[];
  instructions?: string[];
  proceduresPerformed?: ProcedureItem[];
  allergies?: string[];
  followUpRequired?: boolean;
  nextVisit: Date;
  additionalNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PrescriptionDocument = Prescription & Document;

const prescriptionSchema = new Schema<Prescription>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    instructions: { type: [String] },
    proceduresPerformed: [
      {
        procedureName: { type: String, required: true },
        notes: { type: String },
      },
    ],
    allergies: { type: [String], default: [] },
    followUpRequired: { type: Boolean, default: false },
    nextVisit: { type: Date, required: true },
    additionalNotes: { type: String },
  },
  { timestamps: true }
);

const PrescriptionModel: Model<PrescriptionDocument> =
  (mongoose.models.Prescription as Model<PrescriptionDocument>) ||
  mongoose.model<PrescriptionDocument>("Prescription", prescriptionSchema);

export default PrescriptionModel;
