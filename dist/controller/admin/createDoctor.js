"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctor = void 0;
const Dr_1 = __importDefault(require("../../models/Dr"));
const emailUtility_1 = require("../../Utility/emailUtility");
const createDoctor = async (req, res) => {
    try {
        const { name, specialization, experience, consultationFee, rating, totalRatings, availability, workingHours, location, mobileNumber, email, isActive, } = req.body;
        const doctor = await Dr_1.default.create({
            name,
            specialization,
            experience,
            consultationFee,
            rating,
            totalRatings,
            availability,
            workingHours,
            location,
            mobileNumber,
            email,
            isActive,
        });
        if (email) {
            try {
                await (0, emailUtility_1.sendSubscriptionNotification)(email, name, {
                    specialization,
                    consultationFee,
                    subscriptionDate: new Date().toLocaleDateString(),
                });
                console.log(`Subscription notification email sent successfully to Dr. ${name}`);
            }
            catch (emailError) {
                console.error("Failed to send subscription email:", emailError);
            }
        }
        res.status(201).json({
            success: true,
            message: "Doctor created successfully and subscription notification sent",
            doctor,
        });
    }
    catch (error) {
        console.error("Error creating doctor:", error);
        res
            .status(500)
            .json({
            success: false,
            message: "Failed to create doctor",
            error: error.message,
        });
    }
};
exports.createDoctor = createDoctor;
