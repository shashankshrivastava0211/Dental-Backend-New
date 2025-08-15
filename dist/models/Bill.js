"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const billSchema = new mongoose_1.Schema({
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
const BillModel = mongoose_1.models.Bill ||
    (0, mongoose_1.model)("Bill", billSchema);
exports.default = BillModel;
