const Doctor = require("../models/Dr");
const appointment = require("../models/appointment");
const { sendDailyAppointmentsSummary, sendUpcomingBookingsNotification, } = require("./emailUtility");
// Function to get today's appointments for a specific doctor
const getTodayAppointmentsForDoctor = async (doctorId) => {
    const today = new Date();
    const todayString = today.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    try {
        const appointments = await appointment
            .find({
            doctorId: doctorId,
            date: todayString,
            status: { $in: ["pending", "confirmed"] },
        })
            .sort({ time: 1 });
        return appointments;
    }
    catch (error) {
        console.error(`Error fetching today's appointments for doctor ${doctorId}:`, error);
        return [];
    }
};
// Function to send daily summary to a specific doctor
const sendDailySummaryToDoctor = async (doctorId) => {
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.email || !doctor.isActive) {
            return { success: false, message: "Doctor not found or inactive" };
        }
        const todayAppointments = await getTodayAppointmentsForDoctor(doctorId);
        const pendingAppointments = await appointment.countDocuments({
            doctorId: doctorId,
            status: "pending",
        });
        const summary = {
            todayCount: todayAppointments.length,
            pendingCount: pendingAppointments,
            todayAppointments: todayAppointments.map((apt) => ({
                time: apt.time,
                patientName: apt.patientName,
                phoneNo: apt.phoneNo,
                description: apt.description,
            })),
        };
        await sendDailyAppointmentsSummary(doctor.email, doctor.name, summary);
        return {
            success: true,
            message: `Daily summary sent to Dr. ${doctor.name}`,
        };
    }
    catch (error) {
        console.error(`Error sending daily summary to doctor ${doctorId}:`, error);
        return { success: false, error: error.message };
    }
};
// Function to send daily summaries to all active doctors
const sendDailySummariesToAllDoctors = async () => {
    try {
        const activeDoctors = await Doctor.find({
            isActive: true,
            email: { $exists: true, $ne: "" },
        });
        const results = await Promise.allSettled(activeDoctors.map((doctor) => sendDailySummaryToDoctor(doctor._id)));
        const successful = results.filter((result) => result.status === "fulfilled" && result.value.success).length;
        const failed = results.filter((result) => result.status === "rejected" || !result.value.success).length;
        console.log(`Daily summaries sent: ${successful} successful, ${failed} failed`);
        return {
            totalDoctors: activeDoctors.length,
            successful,
            failed,
        };
    }
    catch (error) {
        console.error("Error sending daily summaries to all doctors:", error);
        throw error;
    }
};
// Function to send upcoming bookings notification to a specific doctor
const sendUpcomingBookingsToDoctor = async (doctorId, daysAhead = 7) => {
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.email || !doctor.isActive) {
            return { success: false, message: "Doctor not found or inactive" };
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysAhead);
        const upcomingAppointments = await appointment
            .find({
            doctorId: doctorId,
            date: {
                $gte: startDate.toLocaleDateString("en-GB"),
                $lte: endDate.toLocaleDateString("en-GB"),
            },
            status: { $in: ["pending", "confirmed"] },
        })
            .sort({ date: 1, time: 1 });
        if (upcomingAppointments.length > 0) {
            await sendUpcomingBookingsNotification(doctor.email, doctor.name, upcomingAppointments);
            return {
                success: true,
                message: `Upcoming bookings notification sent to Dr. ${doctor.name}`,
                appointmentCount: upcomingAppointments.length,
            };
        }
        return {
            success: true,
            message: "No upcoming appointments to notify about",
        };
    }
    catch (error) {
        console.error(`Error sending upcoming bookings to doctor ${doctorId}:`, error);
        return { success: false, error: error.message };
    }
};
module.exports = {
    sendDailySummaryToDoctor,
    sendDailySummariesToAllDoctors,
    sendUpcomingBookingsToDoctor,
    getTodayAppointmentsForDoctor,
};
