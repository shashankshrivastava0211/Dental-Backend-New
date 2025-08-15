"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailUtility_1 = require("../Utility/emailUtility");
const router = express_1.default.Router();
router.post("/test-subscription-email", async (req, res) => {
    try {
        const { email, doctorName } = req.body;
        if (!email || !doctorName) {
            return res
                .status(400)
                .json({ success: false, message: "Email and doctorName are required" });
        }
        const result = await (0, emailUtility_1.sendSubscriptionNotification)(email, doctorName, {
            specialization: "Cardiology",
            consultationFee: 1500,
            subscriptionDate: new Date().toLocaleDateString(),
        });
        res.json({
            success: true,
            message: "Test subscription email sent successfully",
            result,
        });
    }
    catch (error) {
        console.error("Error sending test subscription email:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});
router.post("/test-appointment-email", async (req, res) => {
    try {
        const { email, doctorName, appointmentDetails } = req.body;
        if (!email || !doctorName || !appointmentDetails) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Email, doctorName, and appointmentDetails are required",
            });
        }
        const result = await (0, emailUtility_1.sendNewAppointmentNotification)(email, doctorName, appointmentDetails);
        res.json({
            success: true,
            message: "Test appointment email sent successfully",
            result,
        });
    }
    catch (error) {
        console.error("Error sending test appointment email:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});
router.post("/test-daily-summary", async (req, res) => {
    try {
        const { email, doctorName } = req.body;
        if (!email || !doctorName) {
            return res
                .status(400)
                .json({ success: false, message: "Email and doctorName are required" });
        }
        const summary = {
            todayCount: 3,
            pendingCount: 2,
            todayAppointments: [
                {
                    time: "09:00",
                    patientName: "John Doe",
                    phoneNo: "9876543210",
                    description: "Regular checkup",
                },
                {
                    time: "11:00",
                    patientName: "Jane Smith",
                    phoneNo: "9876543211",
                    description: "Follow-up consultation",
                },
                {
                    time: "15:00",
                    patientName: "Mike Johnson",
                    phoneNo: "9876543212",
                    description: "Initial consultation",
                },
            ],
        };
        const result = await (0, emailUtility_1.sendDailyAppointmentsSummary)(email, doctorName, summary);
        res.json({
            success: true,
            message: "Test daily summary email sent successfully",
            result,
        });
    }
    catch (error) {
        console.error("Error sending test daily summary email:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});
router.post("/test-upcoming-bookings", async (req, res) => {
    try {
        const { email, doctorName } = req.body;
        if (!email || !doctorName) {
            return res
                .status(400)
                .json({ success: false, message: "Email and doctorName are required" });
        }
        const upcomingBookings = [
            {
                patientName: "Alice Brown",
                date: "25/12/2024",
                time: "10:00",
                phoneNo: "9876543213",
                age: 35,
                gender: "female",
                description: "Annual checkup",
            },
            {
                patientName: "Bob Wilson",
                date: "26/12/2024",
                time: "14:00",
                phoneNo: "9876543214",
                age: 45,
                gender: "male",
                description: "Follow-up consultation",
            },
        ];
        const result = await (0, emailUtility_1.sendNewAppointmentNotification)(email, doctorName, upcomingBookings);
        res.json({
            success: true,
            message: "Test upcoming bookings email sent successfully",
            result,
        });
    }
    catch (error) {
        console.error("Error sending test upcoming bookings email:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Failed to send test email",
            error: error.message,
        });
    }
});
exports.default = router;
