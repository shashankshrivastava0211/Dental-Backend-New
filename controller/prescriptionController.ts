import { Request, Response } from "express";
import Appointment from "../models/appointment";
import Prescription from "../models/Prescription";

export const prescription = async (req: Request, res: Response) => {
  try {
    const {
      appointmentId,
      medicines,
      instructions,
      proceduresPerformed,
      allergies,
      followUpRequired,
      nextVisit,
      additionalNotes,
      treatments,
    } = req.body as any;

    const appointmentToAddPrescription = await Appointment.findById(
      appointmentId
    );
    if (!appointmentToAddPrescription) {
      throw new Error("Appointment not found");
    }
    const prescription = new Prescription({
      appointmentId,
      medicines,
      instructions,
      proceduresPerformed,
      allergies,
      followUpRequired,
      nextVisit,
      additionalNotes,
      treatments,
    } as any);

    const savedPrescription = await prescription.save();

    await Appointment.updateOne(
      { _id: appointmentId },
      { $set: { prescriptionId: savedPrescription._id, status: "completed" } }
    );

    res.status(201).json(savedPrescription);
  } catch (err: any) {
    console.error("Error saving prescription:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPrescriptionByAppointmentId = async (
  req: Request,
  res: Response
) => {
  try {
    const { appointmentId } = req.query as any;
    const prescription = await Prescription.find({ appointmentId });
    res.status(200).json(prescription);
  } catch (error: any) {
    console.error(
      "Error getting prescription by appointment id:",
      error.message
    );
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { prescriptionId } = req.params as any;
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPrescription);
  } catch (error: any) {
    console.error("Error updating prescription:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body as any;
    const userAuthenticate = password === "admin1234" && userName === "admin";
    if (userAuthenticate) {
      return res
        .status(200)
        .json({ message: "Login Successfull", isLoggedIn: true });
    }
    return res.status(401).json({ message: "Login Failed", isLoggedIn: false });
  } catch (error: any) {
    console.error("Error updating prescription:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
