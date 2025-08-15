"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBill = exports.createBill = exports.billController = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const Bill_1 = __importDefault(require("../models/Bill"));
const billController = async (req, res) => {
    try {
        const { appointmentId, page = 1, limit = 1, paymentMethod, userId, } = req.query;
        let filter = {};
        filter = {
            ...(appointmentId && { appointmentId }),
            ...(paymentMethod && { paymentMethod }),
            ...(userId && { userId }),
        };
        const allBills = await Bill_1.default.find(filter);
        res.status(200).json(allBills);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
    }
};
exports.billController = billController;
const createBill = async (req, res) => {
    const { appointmentId, amount, isBaseAdded, discount, paymentMethod, isPaid, notes, items, } = req.body;
    try {
        const newBill = new Bill_1.default({
            appointmentId,
            amount,
            items,
            isBaseAdded,
            discount,
            paymentMethod,
            isPaid,
            notes,
        });
        const isAppointmentExists = await Bill_1.default.find({ appointmentId });
        const appointmentToUpdate = await appointment_1.default.findById(appointmentId);
        if (isAppointmentExists.length > 0) {
            return res
                .status(400)
                .json({ message: "Bill for this appointment already exists." });
        }
        if (!appointmentId) {
            throw new Error("Appointment ID is required");
        }
        await newBill.save();
        await appointment_1.default.updateOne({ _id: appointmentToUpdate }, { $set: { billID: newBill._id } });
        res.status(201).json(newBill);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || "Server Error" });
    }
};
exports.createBill = createBill;
const updateBill = async (req, res) => {
    const { amount, isBaseAdded, discount, paymentMethod, isPaid, notes, items } = req.body;
    const { billId } = req.params;
    try {
        if (!billId) {
            throw new Error("Bill ID is required");
        }
        const updatedBill = await Bill_1.default.findByIdAndUpdate(billId, { amount, isBaseAdded, discount, paymentMethod, isPaid, notes, items }, { new: true, runValidators: true });
        res.status(200).json(updatedBill);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateBill = updateBill;
