const express = require("express");
const appointmentRouter = express.Router();
const Appointment = require("../models/appointment");
const {
  createAppointment,
  prescription,
  getAppointment,
  updateStatus,
  updateAppointment,
} = require("../controller/appointmentsController");

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     description: Create a new appointment booking for a patient with a specific doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *           example:
 *             doctorId: "507f1f77bcf86cd799439011"
 *             patientName: "Jane Doe"
 *             phoneNo: "9876543210"
 *             date: "25/12/2024"
 *             time: "10"
 *             gender: "female"
 *             age: 30
 *             description: "Regular checkup and consultation"
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                   example: "Appointment created successfully and doctor notified"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
appointmentRouter.post("/appointments", createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get appointments with filters
 *     tags: [Appointments]
 *     description: Retrieve appointments with optional filtering, pagination, and sorting
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range filter (YYYY-MM-DD)
 *         example: "2024-12-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range filter (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by appointment status (comma-separated for multiple)
 *         example: "pending,confirmed"
 *       - in: query
 *         name: phoneNo
 *         schema:
 *           type: string
 *         description: Filter by patient phone number
 *         example: "9876543210"
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Filter by appointment time
 *         example: "10"
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter by specific appointment ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 totalAppointments:
 *                   type: integer
 *                   example: 25
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
appointmentRouter.get("/appointments", getAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update a specific appointment
 *     tags: [Appointments]
 *     description: Update an existing appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *           example:
 *             status: "confirmed"
 *             description: "Updated appointment notes"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
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
 *                   example: "Appointment updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
appointmentRouter.put("/appointments/:id", updateAppointment);

/**
 * @swagger
 * /appointments:
 *   put:
 *     summary: Update multiple appointment statuses
 *     tags: [Appointments]
 *     description: Update the status of multiple appointments at once
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, appointmentIds]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 description: New status for the appointments
 *                 example: "confirmed"
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of appointment IDs to update
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       200:
 *         description: Appointment statuses updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statuses updated successfully"
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request - invalid status or appointment IDs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: One or more appointments not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
appointmentRouter.put("/appointments", updateStatus);

module.exports = appointmentRouter;
