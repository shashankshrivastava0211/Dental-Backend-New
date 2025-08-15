"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = exports.updatePrescription = exports.getPrescriptionByAppointmentId = exports.prescription = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const prescription = async (req, res) => {
    try {
        const { appointmentId, medicines, instructions, proceduresPerformed, allergies, followUpRequired, nextVisit, additionalNotes, treatments, } = req.body;
        const appointmentToAddPrescription = await appointment_1.default.findById(appointmentId);
        if (!appointmentToAddPrescription) {
            throw new Error("Appointment not found");
        }
        const prescription = new Prescription_1.default({
            appointmentId,
            medicines,
            instructions,
            proceduresPerformed,
            allergies,
            followUpRequired,
            nextVisit,
            additionalNotes,
            treatments,
        });
        const savedPrescription = await prescription.save();
        await appointment_1.default.updateOne({ _id: appointmentId }, { $set: { prescriptionId: savedPrescription._id, status: "completed" } });
        res.status(201).json(savedPrescription);
    }
    catch (err) {
        console.error("Error saving prescription:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.prescription = prescription;
const getPrescriptionByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.query;
        const prescription = await Prescription_1.default.find({ appointmentId });
        res.status(200).json(prescription);
    }
    catch (error) {
        console.error("Error getting prescription by appointment id:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getPrescriptionByAppointmentId = getPrescriptionByAppointmentId;
const updatePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const updatedPrescription = await Prescription_1.default.findByIdAndUpdate(prescriptionId, req.body, { new: true });
        res.status(200).json(updatedPrescription);
    }
    catch (error) {
        console.error("Error updating prescription:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updatePrescription = updatePrescription;
const loginAdmin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const userAuthenticate = password === "admin1234" && userName === "admin";
        if (userAuthenticate) {
            return res
                .status(200)
                .json({ message: "Login Successfull", isLoggedIn: true });
        }
        return res.status(401).json({ message: "Login Failed", isLoggedIn: false });
    }
    catch (error) {
        console.error("Error updating prescription:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.loginAdmin = loginAdmin;
