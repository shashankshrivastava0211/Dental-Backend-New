const express = require("express");
const router = express.Router();
const { createDoctor } = require("../controller/admin/createDoctor");

/**
 * @swagger
 * /admin/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     description: Create a new doctor account and send subscription welcome email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *           example:
 *             name: "Dr. John Smith"
 *             specialization: "Cardiology"
 *             experience: 10
 *             consultationFee: 1500
 *             rating: 4.5
 *             totalRatings: 25
 *             availability: "Available"
 *             workingHours:
 *               startTime: "09:00"
 *               endTime: "17:00"
 *               workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
 *             location:
 *               city: "Mumbai"
 *               state: "Maharashtra"
 *               country: "India"
 *               address: "123 Medical Center, Andheri West"
 *             mobileNumber: "+91-9876543210"
 *             email: "dr.john@healthcare.com"
 *             isActive: true
 *     responses:
 *       201:
 *         description: Doctor created successfully and subscription notification sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Doctor created successfully and subscription notification sent"
 *                 doctor:
 *                   $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/doctors", createDoctor);

module.exports = router;
