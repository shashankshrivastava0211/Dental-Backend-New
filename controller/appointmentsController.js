const appointment = require("../models/appointment");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
const Doctor = require("../models/Dr");
const { appointmentCreatedMessage } = require("../Templates/smsTemplates");
const { sendSMS } = require("../Utility/smsUtility");
const { sendNewAppointmentNotification } = require("../Utility/emailUtility");

exports.createAppointment = async (req, res) => {
  try {
    console.log(req.body);
    const appointmentForPatient = new appointment(req.body);

    const { phoneNo, doctorId } = req.body;

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found",
      });
    }

    let user = await User.findOne({ phoneNo });

    if (!user) {
      user = new User({ phoneNo, appointments: [appointmentForPatient._id] });
      await user.save();
    } else {
      user.appointments.push(appointmentForPatient._id);
      await user.save();
    }

    await appointmentForPatient.save();

    // Send email notification to doctor about new appointment
    if (doctor.email) {
      try {
        await sendNewAppointmentNotification(doctor.email, doctor.name, {
          patientName: appointmentForPatient.patientName,
          date: appointmentForPatient.date,
          time: appointmentForPatient.time,
          phoneNo: appointmentForPatient.phoneNo,
          age: appointmentForPatient.age,
          gender: appointmentForPatient.gender,
          description: appointmentForPatient.description,
        });
        console.log(
          `New appointment notification email sent to Dr. ${doctor.name}`
        );
      } catch (emailError) {
        console.error(
          "Failed to send new appointment email notification:",
          emailError
        );
        // Don't fail the appointment creation if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Appointment created successfully and doctor notified",
      appointment: appointmentForPatient,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      // treatment,
      status,
      page = 1,
      limit = 1,
      phoneNo,
      time,
      id,
    } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    // if (treatment) {
    //   filter.treatment = treatment;
    // }

    if (status) {
      const statusArray = Array.isArray(status) ? status : status.split(",");
      filter.status = { $in: statusArray };
    }

    if (phoneNo) {
      filter.phoneNo = phoneNo;
    }
    if (time) {
      filter.time = time;
    }
    if (id) {
      filter._id = id;
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const appointments = await appointment
      .find(filter)
      .populate([
        {
          path: "prescriptionId",
          select:
            "medicines instructions proceduresPerformed allergies followUpRequired nextVisit additionalNotes treatments",
        },
        {
          path: "billID",
          select: "amount dueDate status",
        },
      ])
      .sort({ createdAt: -1 }) // <-- Corrected parentheses
      .skip(skip)
      .limit(limitNumber);

    const totalAppointments = await appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: appointments.length,
      totalAppointments,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalAppointments / limitNumber),
      data: appointments,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// confirm cancel of multiple/Single appointments

exports.updateStatus = async (req, res) => {
  try {
    const { status, appointmentIds } = req.body;
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

    const appointments = await appointment.find({
      _id: { $in: uniqueAppointmentIds },
    });

    if (appointments.length !== uniqueAppointmentIds.length) {
      return res
        .status(404)
        .json({ message: "One or more appointments not found" });
    }

    const updatedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        appt.status = status;
        return appt.save();
      })
    );

    res.status(200).json({
      message: "Statuses updated successfully",
      count: updatedAppointments.length,
      data: updatedAppointments,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params; // Get appointment ID from request params
    const updateData = req.body; // Data to update

    // Find and update the appointment
    const updatedAppointment = await appointment.findByIdAndUpdate(
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
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
