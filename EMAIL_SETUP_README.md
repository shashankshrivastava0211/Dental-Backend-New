# Email Notification System for Doctors

This system provides comprehensive email notifications for doctors in your multi-tenant appointment booking system.

## 🚀 Features

### 1. **Subscription Notification**

- Sent when a doctor's subscription is recorded
- Welcome email with subscription details
- Information about next steps

### 2. **New Appointment Notifications**

- Real-time notification when patients book appointments
- Complete appointment details included
- Professional HTML email templates

### 3. **Daily Appointment Summaries**

- Daily overview of appointments
- Count of today's appointments and pending confirmations
- Detailed schedule for the day

### 4. **Upcoming Bookings Notifications**

- Weekly overview of upcoming appointments
- Patient details and appointment information
- Action items for doctors

## 📧 Email Templates

All emails use professional HTML templates with:

- Responsive design
- Professional color scheme
- Clear information hierarchy
- Call-to-action buttons
- Mobile-friendly layout

## 🔧 Setup Instructions

### 1. **Install Dependencies**

```bash
npm install nodemailer
```

### 2. **Environment Variables**

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# For Gmail users:
# 1. Enable 2-factor authentication
# 2. Generate an "App Password"
# 3. Use the app password instead of your regular password
```

### 3. **Gmail Setup (Recommended)**

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
4. Use this password in your `.env` file

### 4. **Other Email Services**

You can use other services by changing `EMAIL_SERVICE`:

- `outlook` for Microsoft 365
- `yahoo` for Yahoo Mail
- `hotmail` for Hotmail/Outlook.com

## 📱 API Endpoints

### Test Email Functionality

#### 1. **Test Subscription Email**

```http
POST /api/v1/email-test/test-subscription-email
Content-Type: application/json

{
  "email": "doctor@example.com",
  "doctorName": "Dr. John Smith"
}
```

#### 2. **Test New Appointment Email**

```http
POST /api/v1/email-test/test-appointment-email
Content-Type: application/json

{
  "email": "doctor@example.com",
  "doctorName": "Dr. John Smith",
  "appointmentDetails": {
    "patientName": "Jane Doe",
    "date": "25/12/2024",
    "time": "10:00",
    "phoneNo": "9876543210",
    "age": 30,
    "gender": "female",
    "description": "Regular checkup"
  }
}
```

#### 3. **Test Daily Summary Email**

```http
POST /api/v1/email-test/test-daily-summary
Content-Type: application/json

{
  "email": "doctor@example.com",
  "doctorName": "Dr. John Smith"
}
```

#### 4. **Test Upcoming Bookings Email**

```http
POST /api/v1/email-test/test-upcoming-bookings
Content-Type: application/json

{
  "email": "doctor@example.com",
  "doctorName": "Dr. John Smith"
}
```

## 🔄 Automatic Email Triggers

### 1. **Subscription Emails**

- Automatically sent when creating a doctor via `createDoctor` controller
- Includes doctor details and subscription information

### 2. **Appointment Notifications**

- Automatically sent when new appointments are created
- Includes complete patient and appointment details

### 3. **Scheduled Emails**

Use the utility functions for scheduled tasks:

```javascript
const {
  sendDailySummariesToAllDoctors,
} = require("./Utility/scheduledEmailTasks");

// Send daily summaries to all active doctors
await sendDailySummariesToAllDoctors();

// Send daily summary to specific doctor
await sendDailySummaryToDoctor(doctorId);

// Send upcoming bookings notification
await sendUpcomingBookingsToDoctor(doctorId, 7); // 7 days ahead
```

## 📊 Email Content Examples

### Subscription Welcome Email

- Doctor's name and welcome message
- Subscription confirmation
- Next steps and platform access
- Contact information

### New Appointment Email

- Patient details (name, age, gender)
- Appointment date and time
- Patient contact information
- Notes/description
- Call-to-action to manage appointment

### Daily Summary Email

- Today's appointment count
- Pending confirmations count
- Detailed schedule for the day
- Quick access to dashboard

### Upcoming Bookings Email

- Weekly appointment overview
- Patient details for each appointment
- Action items and reminders

## 🛠️ Customization

### Modify Email Templates

Edit the HTML templates in `Utility/emailUtility.js`:

- Change colors and styling
- Modify content structure
- Add your company branding
- Customize email subjects

### Add New Email Types

1. Create new function in `emailUtility.js`
2. Add to module.exports
3. Create corresponding test route
4. Integrate with your controllers

## 🚨 Error Handling

- Email failures don't break main functionality
- Comprehensive error logging
- Graceful fallbacks
- Retry mechanisms can be added

## 📈 Monitoring

- Email delivery logs in console
- Success/failure tracking
- Performance metrics
- Delivery status monitoring

## 🔒 Security

- Environment variable protection
- No hardcoded credentials
- Secure email transmission
- Access control for test endpoints

## 🧪 Testing

1. Set up your email credentials
2. Use the test endpoints to verify functionality
3. Check email delivery and formatting
4. Test with different email clients
5. Verify mobile responsiveness

## 📞 Support

If you encounter issues:

1. Check console logs for error messages
2. Verify environment variables
3. Test email credentials manually
4. Check email service status
5. Review network connectivity

## 🎯 Next Steps

1. **Set up email credentials** in your `.env` file
2. **Test the email functionality** using the test endpoints
3. **Integrate with your cron jobs** for scheduled emails
4. **Customize email templates** to match your branding
5. **Monitor email delivery** and performance
6. **Add email preferences** for doctors (frequency, types)

---

**Note**: This system is designed to be production-ready with proper error handling and logging. Test thoroughly before deploying to production.
