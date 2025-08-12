// Email Configuration for Nodemailer
// Add these environment variables to your .env file

module.exports = {
  // Email service (gmail, outlook, yahoo, etc.)
  service: process.env.EMAIL_SERVICE || "gmail",

  // Email credentials
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,

  // Email templates
  templates: {
    subscriptionNotification: {
      subject: "🎉 Welcome! Your Subscription is Now Active",
      template: "subscription-welcome",
    },
    upcomingBookings: {
      subject: "📅 Upcoming Appointments - Action Required",
      template: "upcoming-bookings",
    },
  },
};

/*
Required Environment Variables (.env file):

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

Note: For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" 
3. Use the app password instead of your regular password
*/
