import { Request, Response } from "express";
import Appointment from "../models/appointment";
import Bill from "../models/Bill";

export const billController = async (req: Request, res: Response) => {
  try {
    const {
      appointmentId,
      page = 1,
      limit = 1,
      paymentMethod,
      userId,
    } = req.query as any;
    let filter: any = {};
    filter = {
      ...(appointmentId && { appointmentId }),
      ...(paymentMethod && { paymentMethod }),
      ...(userId && { userId }),
    };

    const allBills = await Bill.find(filter);
    res.status(200).json(allBills);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const createBill = async (req: Request, res: Response) => {
  const {
    appointmentId,
    amount,
    isBaseAdded,
    discount,
    paymentMethod,
    isPaid,
    notes,
    items,
  } = req.body as any;

  try {
    const newBill = new Bill({
      appointmentId,
      amount,
      items,
      isBaseAdded,
      discount,
      paymentMethod,
      isPaid,
      notes,
    } as any);

    const isAppointmentExists = await Bill.find({ appointmentId });
    const appointmentToUpdate = await Appointment.findById(appointmentId);
    if (isAppointmentExists.length > 0) {
      return res
        .status(400)
        .json({ message: "Bill for this appointment already exists." });
    }
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    await newBill.save();
    await Appointment.updateOne(
      { _id: appointmentToUpdate },
      { $set: { billID: newBill._id } }
    );
    res.status(201).json(newBill);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

export const updateBill = async (req: Request, res: Response) => {
  const { amount, isBaseAdded, discount, paymentMethod, isPaid, notes, items } =
    req.body as any;
  const { billId } = req.params as any;
  try {
    if (!billId) {
      throw new Error("Bill ID is required");
    }
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { amount, isBaseAdded, discount, paymentMethod, isPaid, notes, items },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedBill);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
