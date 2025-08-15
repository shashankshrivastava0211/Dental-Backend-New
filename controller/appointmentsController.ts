import { Request, Response } from "express";
import Appointment from "../models/appointment";
import Prescription from "../models/Prescription";
import User from "../models/User";
import Doctor from "../models/Dr";
import { appointmentCreatedMessage } from "../Templates/smsTemplates";
import { sendSMS } from "../Utility/smsUtility";
import { sendNewAppointmentNotification } from "../Utility/emailUtility";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const appointmentForPatient = new Appointment(req.body as any);

    const { phoneNo, doctorId } = req.body as any;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not found" });
    }

    let user = await User.findOne({ phoneNo });

    if (!user) {
      user = new User({
        phoneNo,
        appointments: [appointmentForPatient._id],
      } as any);
      await user.save();
    } else {
      (user as any).appointments.push(appointmentForPatient._id);
      await user.save();
    }

    await appointmentForPatient.save();

    if ((doctor as any).email) {
      try {
        await sendNewAppointmentNotification(
          (doctor as any).email,
          (doctor as any).name,
          {
            patientName: (appointmentForPatient as any).patientName,
            date: (appointmentForPatient as any).date,
            time: (appointmentForPatient as any).time,
            phoneNo: (appointmentForPatient as any).phoneNo,
            age: (appointmentForPatient as any).age,
            gender: (appointmentForPatient as any).gender,
            description: (appointmentForPatient as any).description,
          }
        );
        console.log(
          `New appointment notification email sent to Dr. ${
            (doctor as any).name
          }`
        );
      } catch (emailError) {
        console.error(
          "Failed to send new appointment email notification:",
          emailError
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Appointment created successfully and doctor notified",
      appointment: appointmentForPatient,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      status,
      page = 1,
      limit = 1,
      phoneNo,
      time,
      id,
    } = req.query as any;

    let filter: any = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    if (status) {
      const statusArray = Array.isArray(status)
        ? status
        : (status as string).split(",");
      filter.status = { $in: statusArray };
    }

    if (phoneNo) filter.phoneNo = phoneNo;
    if (time) filter.time = time;
    if (id) filter._id = id;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const appointments = await Appointment.find(filter)
      .populate([
        {
          path: "prescriptionId",
          select:
            "medicines instructions proceduresPerformed allergies followUpRequired nextVisit additionalNotes treatments",
        },
        { path: "billID", select: "amount dueDate status" },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalAppointments = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: appointments.length,
      totalAppointments,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalAppointments / limitNumber),
      data: appointments,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status, appointmentIds } = req.body as any;
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

    const appointments = await Appointment.find({
      _id: { $in: uniqueAppointmentIds },
    });

    if (appointments.length !== uniqueAppointmentIds.length) {
      return res
        .status(404)
        .json({ message: "One or more appointments not found" });
    }

    const updatedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        (appt as any).status = status;
        return appt.save();
      })
    );

    res.status(200).json({
      message: "Statuses updated successfully",
      count: updatedAppointments.length,
      data: updatedAppointments,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as any;
    const updateData = req.body as any;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

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
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
