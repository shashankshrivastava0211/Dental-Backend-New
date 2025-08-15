import { Request, Response } from "express";
import Doctor from "../../models/Dr";
import { sendSubscriptionNotification } from "../../Utility/emailUtility";

export const createDoctor = async (req: Request, res: Response) => {
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
    } = req.body as any;

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
    } as any);

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
      }
    }

    res.status(201).json({
      success: true,
      message: "Doctor created successfully and subscription notification sent",
      doctor,
    });
  } catch (error: any) {
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
