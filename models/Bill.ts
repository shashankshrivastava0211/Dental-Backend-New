import { Schema, model, Document, Model, models, Types } from "mongoose";

export interface BillItem {
  amount: number;
  description: string;
}
export type PaymentMethod = "cash" | "card" | "upi" | "insurance";

export interface Bill {
  doctorId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  amount: number;
  isBaseAdded?: boolean;
  discount?: number;
  paymentMethod: PaymentMethod;
  items: BillItem[];
  isPaid?: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BillDocument = Bill & Document;

const billSchema = new Schema<Bill>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: { type: Number, required: true },
    isBaseAdded: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "insurance"],
      required: true,
    },
    items: [
      {
        amount: { type: Number, required: true },
        description: { type: String, required: true },
      },
    ],
    isPaid: { type: Boolean, default: false },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const BillModel: Model<BillDocument> =
  (models.Bill as Model<BillDocument>) ||
  model<BillDocument>("Bill", billSchema);

export default BillModel;
