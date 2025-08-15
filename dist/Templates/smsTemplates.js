const appointmentCreatedMessage = (appointment) => {
    const { patientName, treatment, date, time, description, status } = appointment;
    const message = `Hello ${patientName},\n\nYour ${treatment} appointment has been Created successfully.\nAppointment Status: ${status}\nDate: ${date}\nTime: ${time}:00\n${description ? `Description: ${description}` : ''}\nPlease ensure you arrive 10 minutes early.\n\nBest regards,\n Your Clinic`;
    return message;
};
module.exports = { appointmentCreatedMessage };
