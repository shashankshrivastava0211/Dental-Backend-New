const express = require("express");
const router = express.Router();
const {
  sendSubscriptionNotification,
  sendNewAppointmentNotification,
  sendDailyAppointmentsSummary,
} = require("../Utility/emailUtility");
const {
  sendDailySummaryToDoctor,
  sendUpcomingBookingsToDoctor,
} = require("../Utility/scheduledEmailTasks");

/**
 * @swagger
 * /email-test/test-subscription-email:
 *   post:
 *     summary: Test subscription notification email
 *     tags: [Email Testing]
 *     description: Send a test subscription welcome email to verify email functionality
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, doctorName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Doctor's email address
 *                 example: "dr.john@healthcare.com"
 *               doctorName:
 *                 type: string
 *                 description: Doctor's full name
 *                 example: "Dr. John Smith"
 *     responses:
 *       200:
 *         description: Test subscription email sent successfully
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
 *                   example: "Test subscription email sent successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "<random-message-id@email.com>"
 *       400:
 *         description: Bad request - missing required fields
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
router.post("/test-subscription-email", async (req, res) => {
  try {
    const { email, doctorName } = req.body;

    if (!email || !doctorName) {
      return res.status(400).json({
        success: false,
        message: "Email and doctorName are required",
      });
    }

    const result = await sendSubscriptionNotification(email, doctorName, {
      specialization: "Cardiology",
      consultationFee: 1500,
      subscriptionDate: new Date().toLocaleDateString(),
    });

    res.json({
      success: true,
      message: "Test subscription email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error sending test subscription email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /email-test/test-appointment-email:
 *   post:
 *     summary: Test new appointment notification email
 *     tags: [Email Testing]
 *     description: Send a test new appointment notification email to verify email functionality
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, doctorName, appointmentDetails]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Doctor's email address
 *                 example: "dr.john@healthcare.com"
 *               doctorName:
 *                 type: string
 *                 description: Doctor's full name
 *                 example: "Dr. John Smith"
 *               appointmentDetails:
 *                 type: object
 *                 required: [patientName, date, time, phoneNo, age, gender]
 *                 properties:
 *                   patientName:
 *                     type: string
 *                     example: "Jane Doe"
 *                   date:
 *                     type: string
 *                     example: "25/12/2024"
 *                   time:
 *                     type: string
 *                     example: "10:00"
 *                   phoneNo:
 *                     type: string
 *                     example: "9876543210"
 *                   age:
 *                     type: number
 *                     example: 30
 *                   gender:
 *                     type: string
 *                     enum: [male, female, others]
 *                     example: "female"
 *                   description:
 *                     type: string
 *                     example: "Regular checkup and consultation"
 *     responses:
 *       200:
 *         description: Test appointment email sent successfully
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
 *                   example: "Test appointment email sent successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "<random-message-id@email.com>"
 *       400:
 *         description: Bad request - missing required fields
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
// Test route to send new appointment notification
router.post("/test-appointment-email", async (req, res) => {
  try {
    const { email, doctorName, appointmentDetails } = req.body;

    if (!email || !doctorName || !appointmentDetails) {
      return res.status(400).json({
        success: false,
        message: "Email, doctorName, and appointmentDetails are required",
      });
    }

    const result = await sendNewAppointmentNotification(
      email,
      doctorName,
      appointmentDetails
    );

    res.json({
      success: true,
      message: "Test appointment email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error sending test appointment email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /email-test/test-daily-summary:
 *   post:
 *     summary: Test daily appointments summary email
 *     tags: [Email Testing]
 *     description: Send a test daily summary email to verify email functionality
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, doctorName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Doctor's email address
 *                 example: "dr.john@healthcare.com"
 *               doctorName:
 *                 type: string
 *                 description: Doctor's full name
 *                 example: "Dr. John Smith"
 *     responses:
 *       200:
 *         description: Test daily summary email sent successfully
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
 *                   example: "Test daily summary email sent successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "<random-message-id@email.com>"
 *       400:
 *         description: Bad request - missing required fields
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
// Test route to send daily summary
router.post("/test-daily-summary", async (req, res) => {
  try {
    const { email, doctorName } = req.body;

    if (!email || !doctorName) {
      return res.status(400).json({
        success: false,
        message: "Email and doctorName are required",
      });
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

    const result = await sendDailyAppointmentsSummary(
      email,
      doctorName,
      summary
    );

    res.json({
      success: true,
      message: "Test daily summary email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error sending test daily summary email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /email-test/test-upcoming-bookings:
 *   post:
 *     summary: Test upcoming bookings notification email
 *     tags: [Email Testing]
 *     description: Send a test upcoming bookings notification email to verify email functionality
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, doctorName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Doctor's email address
 *                 example: "dr.john@healthcare.com"
 *               doctorName:
 *                 type: string
 *                 description: Doctor's full name
 *                 example: "Dr. John Smith"
 *     responses:
 *       200:
 *         description: Test upcoming bookings email sent successfully
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
 *                   example: "Test upcoming bookings email sent successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     messageId:
 *                       type: string
 *                       example: "<random-message-id@email.com>"
 *       400:
 *         description: Bad request - missing required fields
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
// Test route to send upcoming bookings notification
router.post("/test-upcoming-bookings", async (req, res) => {
  try {
    const { email, doctorName } = req.body;

    if (!email || !doctorName) {
      return res.status(400).json({
        success: false,
        message: "Email and doctorName are required",
      });
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

    const result = await sendUpcomingBookingsNotification(
      email,
      doctorName,
      upcomingBookings
    );

    res.json({
      success: true,
      message: "Test upcoming bookings email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error sending test upcoming bookings email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

module.exports = router;
