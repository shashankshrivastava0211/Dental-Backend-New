"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointment = exports.updateStatus = exports.getAppointment = exports.createAppointment = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const User_1 = __importDefault(require("../models/User"));
const Dr_1 = __importDefault(require("../models/Dr"));
const emailUtility_1 = require("../Utility/emailUtility");
const createAppointment = async (req, res) => {
    try {
        console.log(req.body);
        const appointmentForPatient = new appointment_1.default(req.body);
        const { phoneNo, doctorId } = req.body;
        const doctor = await Dr_1.default.findById(doctorId);
        if (!doctor) {
            return res
                .status(400)
                .json({ success: false, message: "Doctor not found" });
        }
        let user = await User_1.default.findOne({ phoneNo });
        if (!user) {
            user = new User_1.default({
                phoneNo,
                appointments: [appointmentForPatient._id],
            });
            await user.save();
        }
        else {
            user.appointments.push(appointmentForPatient._id);
            await user.save();
        }
        await appointmentForPatient.save();
        if (doctor.email) {
            try {
                await (0, emailUtility_1.sendNewAppointmentNotification)(doctor.email, doctor.name, {
                    patientName: appointmentForPatient.patientName,
                    date: appointmentForPatient.date,
                    time: appointmentForPatient.time,
                    phoneNo: appointmentForPatient.phoneNo,
                    age: appointmentForPatient.age,
                    gender: appointmentForPatient.gender,
                    description: appointmentForPatient.description,
                });
                console.log(`New appointment notification email sent to Dr. ${doctor.name}`);
            }
            catch (emailError) {
                console.error("Failed to send new appointment email notification:", emailError);
            }
        }
        res.status(201).json({
            success: true,
            message: "Appointment created successfully and doctor notified",
            appointment: appointmentForPatient,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.createAppointment = createAppointment;
const getAppointment = async (req, res) => {
    try {
        const { startDate, endDate, status, page = 1, limit = 1, phoneNo, time, id, } = req.query;
        let filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        else if (startDate) {
            filter.date = { $gte: new Date(startDate) };
        }
        else if (endDate) {
            filter.date = { $lte: new Date(endDate) };
        }
        if (status) {
            const statusArray = Array.isArray(status)
                ? status
                : status.split(",");
            filter.status = { $in: statusArray };
        }
        if (phoneNo)
            filter.phoneNo = phoneNo;
        if (time)
            filter.time = time;
        if (id)
            filter._id = id;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const appointments = await appointment_1.default.find(filter)
            .populate([
            {
                path: "prescriptionId",
                select: "medicines instructions proceduresPerformed allergies followUpRequired nextVisit additionalNotes treatments",
            },
            { path: "billID", select: "amount dueDate status" },
        ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        const totalAppointments = await appointment_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            count: appointments.length,
            totalAppointments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalAppointments / limitNumber),
            data: appointments,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getAppointment = getAppointment;
const updateStatus = async (req, res) => {
    try {
        const { status, appointmentIds } = req.body;
        const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (!Array.isArray(appointmentIds) || appointmentIds.length === 0) {
            return res
                .status(400)
                .json({ message: "appointmentIds must be a non-empty array" });
        }
        const uniqueAppointmentIds = [...new Set(appointmentIds)];
        const appointments = await appointment_1.default.find({
            _id: { $in: uniqueAppointmentIds },
        });
        if (appointments.length !== uniqueAppointmentIds.length) {
            return res
                .status(404)
                .json({ message: "One or more appointments not found" });
        }
        const updatedAppointments = await Promise.all(appointments.map(async (appt) => {
            appt.status = status;
            return appt.save();
        }));
        res.status(200).json({
            message: "Statuses updated successfully",
            count: updatedAppointments.length,
            data: updatedAppointments,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateStatus = updateStatus;
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedAppointment = await appointment_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedAppointment) {
            return res
                .status(404)
                .json({ success: false, message: "Appointment not found" });
        }
        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            data: updatedAppointment,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateAppointment = updateAppointment;
