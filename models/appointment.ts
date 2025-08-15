import mongoose, { Schema, Document, Model } from "mongoose";
import moment from "moment";

export interface Appointment {
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  phoneNo: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  date: string; // DD/MM/YYYY
  time: string; // HH
  description?: string;
  gender: "male" | "female" | "others";
  age: number;
  prescriptionId?: mongoose.Types.ObjectId | null;
  billID?: mongoose.Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AppointmentDocument = Appointment & Document;

const appointmentSchema = new Schema<Appointment>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 13,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return (
            moment(value, "DD/MM/YYYY", true).isValid() &&
            moment(value, "DD/MM/YYYY").isSameOrAfter(moment().startOf("day"))
          );
        },
        message:
          "Date must be in 'DD/MM/YYYY' format and today or in the future.",
      },
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^([01]?[0-9]|2[0-3])$/.test(value);
        },
        message: "Time must be in 'HH' format (24-hour clock).",
      },
    },
    description: { type: String, trim: true, maxlength: 200 },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    age: { type: Number, required: true, min: 1, max: 120 },
    prescriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    billID: { type: Schema.Types.ObjectId, ref: "Bill", default: null },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 } as any);

const AppointmentModel: Model<AppointmentDocument> =
  (mongoose.models.Appointment as Model<AppointmentDocument>) ||
  mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);

export default AppointmentModel;
