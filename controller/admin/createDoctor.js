const Doctor = require("../../models/Dr");
const { sendSubscriptionNotification } = require("../../Utility/emailUtility");

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
exports.createDoctor = async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Create the doctor
    const doctor = await Doctor.create({
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

    // Send subscription notification email to the doctor
    if (email) {
      try {
        await sendSubscriptionNotification(email, name, {
          specialization,
          consultationFee,
          subscriptionDate: new Date().toLocaleDateString(),
        });
        console.log(
          `Subscription notification email sent successfully to Dr. ${name}`
        );
      } catch (emailError) {
        console.error("Failed to send subscription email:", emailError);
        // Don't fail the doctor creation if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Doctor created successfully and subscription notification sent",
      doctor,
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};
