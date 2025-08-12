require("dotenv").config();
const nodemailer = require("nodemailer");

// Create transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Function to send subscription notification email to doctor
const sendSubscriptionNotification = async (
  doctorEmail,
  doctorName,
  subscriptionDetails
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "🎉 Welcome! Your Subscription is Now Active",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; margin: 0; font-size: 28px;">🎉 Welcome, Dr. ${doctorName}!</h1>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Your Subscription is Now Active</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Congratulations! Your subscription has been successfully recorded and you're now part of our healthcare platform.
              </p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px;">📋 What's Next?</h3>
              <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Your profile is now visible to patients</li>
                <li>You can start receiving appointment bookings</li>
                <li>Access your dashboard to manage patients and schedules</li>
                <li>View upcoming bookings and patient information</li>
              </ul>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">🔐 Access Your Dashboard</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Log in to your dashboard to start managing appointments and patient care.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Subscription notification email sent to Dr. ${doctorName}: ${info.messageId}`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending subscription notification email:", error);
    throw error;
  }
};

// Function to send upcoming bookings notification
const sendUpcomingBookingsNotification = async (
  doctorEmail,
  doctorName,
  upcomingBookings
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "📅 Upcoming Appointments - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0; font-size: 28px;">📅 Upcoming Appointments</h1>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Hello Dr. ${doctorName},</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                You have ${
                  upcomingBookings.length
                } upcoming appointment(s) that require your attention.
              </p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">📋 Appointment Summary</h3>
              ${upcomingBookings
                .map(
                  (booking) => `
                <div style="border-left: 4px solid #007bff; padding-left: 15px; margin-bottom: 15px;">
                  <p style="color: #333; font-weight: bold; margin: 0 0 5px 0;">
                    ${booking.patientName} - ${booking.date} at ${booking.time}
                  </p>
                  <p style="color: #666; margin: 0; font-size: 14px;">
                    Phone: ${booking.phoneNo} | Age: ${booking.age} | Gender: ${
                    booking.gender
                  }
                  </p>
                  ${
                    booking.description
                      ? `<p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Notes: ${booking.description}</p>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">🔐 Manage Appointments</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Log in to your dashboard to view full details and manage these appointments.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Please ensure you're prepared for these appointments.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Upcoming bookings notification sent to Dr. ${doctorName}: ${info.messageId}`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending upcoming bookings notification email:", error);
    throw error;
  }
};

// Function to send notification when new appointment is created
const sendNewAppointmentNotification = async (
  doctorEmail,
  doctorName,
  appointmentDetails
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "🆕 New Appointment Booking Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; margin: 0; font-size: 28px;">🆕 New Appointment</h1>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Hello Dr. ${doctorName},</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                You have received a new appointment booking from a patient.
              </p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px;">📋 Appointment Details</h3>
              <div style="border-left: 4px solid #28a745; padding-left: 15px;">
                <p style="color: #333; font-weight: bold; margin: 0 0 5px 0;">
                  Patient: ${appointmentDetails.patientName}
                </p>
                <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">
                  Date: ${appointmentDetails.date} | Time: ${
        appointmentDetails.time
      }
                </p>
                <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">
                  Phone: ${appointmentDetails.phoneNo} | Age: ${
        appointmentDetails.age
      } | Gender: ${appointmentDetails.gender}
                </p>
                ${
                  appointmentDetails.description
                    ? `<p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Notes: ${appointmentDetails.description}</p>`
                    : ""
                }
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">🔐 Manage Appointment</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Log in to your dashboard to confirm, reschedule, or manage this appointment.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Please review and take appropriate action on this appointment.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `New appointment notification sent to Dr. ${doctorName}: ${info.messageId}`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending new appointment notification email:", error);
    throw error;
  }
};

// Function to send daily summary of upcoming appointments
const sendDailyAppointmentsSummary = async (
  doctorEmail,
  doctorName,
  appointmentsSummary
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "📊 Daily Appointments Summary",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0; font-size: 28px;">📊 Daily Summary</h1>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Hello Dr. ${doctorName},</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Here's your daily appointments summary for ${new Date().toLocaleDateString()}.
              </p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 18px;">📈 Today's Overview</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="text-align: center; padding: 15px; background-color: #ffffff; border-radius: 6px;">
                  <h4 style="color: #28a745; margin: 0 0 5px 0; font-size: 24px;">${
                    appointmentsSummary.todayCount
                  }</h4>
                  <p style="color: #666; margin: 0; font-size: 14px;">Today's Appointments</p>
                </div>
                <div style="text-align: center; padding: 15px; background-color: #ffffff; border-radius: 6px;">
                  <h4 style="color: #007bff; margin: 0 0 5px 0; font-size: 24px;">${
                    appointmentsSummary.pendingCount
                  }</h4>
                  <p style="color: #666; margin: 0; font-size: 14px;">Pending Confirmation</p>
                </div>
              </div>
            </div>
            
            ${
              appointmentsSummary.todayAppointments.length > 0
                ? `
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">📅 Today's Schedule</h3>
              ${appointmentsSummary.todayAppointments
                .map(
                  (apt) => `
                <div style="border-left: 4px solid #007bff; padding-left: 15px; margin-bottom: 10px;">
                  <p style="color: #333; font-weight: bold; margin: 0 0 3px 0;">
                    ${apt.time} - ${apt.patientName}
                  </p>
                  <p style="color: #666; margin: 0; font-size: 13px;">
                    ${apt.phoneNo} | ${apt.description || "No notes"}
                  </p>
                </div>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">🔐 Access Dashboard</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                Log in to your dashboard for complete appointment management and patient details.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Have a great day, Dr. ${doctorName}!
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Daily summary sent to Dr. ${doctorName}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending daily summary email:", error);
    throw error;
  }
};

module.exports = {
  sendSubscriptionNotification,
  sendUpcomingBookingsNotification,
  sendNewAppointmentNotification,
  sendDailyAppointmentsSummary,
};
