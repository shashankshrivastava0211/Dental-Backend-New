const mongoose = require("mongoose");
const moment = require("moment");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 13,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"], // status can be pending, confirmed, or cancelled
      default: "pending",
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return (
            moment(value, "DD/MM/YYYY", true).isValid() &&
            moment(value, "DD/MM/YYYY").isSameOrAfter(moment().startOf("day"))
          );
        },
        message:
          "Date must be in 'DD/MM/YYYY' format and today or in the future.",
      },
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^([01]?[0-9]|2[0-3])$/.test(value);
        },
        message: "Time must be in 'HH' format (24-hour clock).",
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    billID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      default: null,
    },
  },
  { timestamps: true }
);

// Adding indexes for better query performance
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }); // for doctor-specific appointments
appointmentSchema.index({ doctorId: 1, status: 1 }); // for doctor's appointment status queries

module.exports = mongoose.model("Appointment", appointmentSchema);
