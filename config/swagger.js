const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Healthcare Appointment Booking API",
      version: "1.0.0",
      description:
        "A comprehensive API for managing doctor appointments, prescriptions, bills, and patient data in a multi-doctor subscription system.",
      contact: {
        name: "API Support",
        email: "support@healthcare.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://your-production-domain.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Doctor: {
          type: "object",
          required: [
            "name",
            "specialization",
            "experience",
            "consultationFee",
            "availability",
            "location",
            "mobileNumber",
          ],
          properties: {
            name: {
              type: "string",
              description: "Doctor's full name",
              example: "Dr. John Smith",
            },
            specialization: {
              type: "string",
              description: "Medical specialization",
              example: "Cardiology",
            },
            experience: {
              type: "number",
              description: "Years of experience",
              minimum: 0,
              example: 10,
            },
            consultationFee: {
              type: "number",
              description: "Consultation fee in currency units",
              minimum: 0,
              example: 1500,
            },
            rating: {
              type: "number",
              description: "Doctor rating (0-5)",
              minimum: 0,
              maximum: 5,
              example: 4.5,
            },
            availability: {
              type: "string",
              enum: ["Available", "Busy", "Unavailable", "On Leave"],
              description: "Current availability status",
              example: "Available",
            },
            workingHours: {
              type: "object",
              properties: {
                startTime: {
                  type: "string",
                  description: "Start time in HH:MM format",
                  example: "09:00",
                },
                endTime: {
                  type: "string",
                  description: "End time in HH:MM format",
                  example: "17:00",
                },
                workingDays: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Working days of the week",
                  example: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                },
              },
            },
            location: {
              type: "object",
              required: ["city", "state", "country"],
              properties: {
                city: {
                  type: "string",
                  example: "Mumbai",
                },
                state: {
                  type: "string",
                  example: "Maharashtra",
                },
                country: {
                  type: "string",
                  example: "India",
                },
                address: {
                  type: "string",
                  example: "123 Medical Center, Andheri West",
                },
              },
            },
            mobileNumber: {
              type: "string",
              description: "Contact mobile number",
              example: "+91-9876543210",
            },
            email: {
              type: "string",
              format: "email",
              description: "Contact email address",
              example: "dr.john@healthcare.com",
            },
            isActive: {
              type: "boolean",
              description: "Whether the doctor is active",
              default: true,
            },
          },
        },
        Appointment: {
          type: "object",
          required: [
            "doctorId",
            "patientName",
            "phoneNo",
            "date",
            "time",
            "gender",
            "age",
          ],
          properties: {
            doctorId: {
              type: "string",
              description: "Reference to Doctor model",
              example: "507f1f77bcf86cd799439011",
            },
            patientName: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              example: "Jane Doe",
            },
            phoneNo: {
              type: "string",
              minLength: 10,
              maxLength: 13,
              example: "9876543210",
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "completed"],
              default: "pending",
              description: "Appointment status",
            },
            date: {
              type: "string",
              description: "Appointment date in DD/MM/YYYY format",
              example: "25/12/2024",
            },
            time: {
              type: "string",
              description: "Appointment time in HH format (24-hour)",
              example: "10",
            },
            description: {
              type: "string",
              maxLength: 200,
              description: "Appointment description or notes",
              example: "Regular checkup and consultation",
            },
            gender: {
              type: "string",
              enum: ["male", "female", "others"],
              example: "female",
            },
            age: {
              type: "number",
              minimum: 1,
              maximum: 120,
              example: 30,
            },
            prescriptionId: {
              type: "string",
              description: "Reference to Prescription model",
              example: "507f1f77bcf86cd799439012",
            },
            billID: {
              type: "string",
              description: "Reference to Bill model",
              example: "507f1f77bcf86cd799439013",
            },
          },
        },
        Prescription: {
          type: "object",
          required: ["doctorId", "appointmentId", "medicines", "nextVisit"],
          properties: {
            doctorId: {
              type: "string",
              description: "Reference to Doctor model",
              example: "507f1f77bcf86cd799439011",
            },
            appointmentId: {
              type: "string",
              description: "Reference to Appointment model",
              example: "507f1f77bcf86cd799439012",
            },
            medicines: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "dosage", "frequency", "duration"],
                properties: {
                  name: {
                    type: "string",
                    example: "Paracetamol",
                  },
                  dosage: {
                    type: "string",
                    example: "500mg",
                  },
                  frequency: {
                    type: "string",
                    example: "Twice daily",
                  },
                  duration: {
                    type: "string",
                    example: "5 days",
                  },
                },
              },
            },
            instructions: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Take with food", "Avoid alcohol"],
            },
            proceduresPerformed: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  procedureName: {
                    type: "string",
                    example: "Blood pressure check",
                  },
                  notes: {
                    type: "string",
                    example: "Normal range",
                  },
                },
              },
            },
            allergies: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Penicillin", "Sulfa drugs"],
            },
            followUpRequired: {
              type: "boolean",
              default: false,
            },
            nextVisit: {
              type: "string",
              format: "date",
              example: "2024-01-15",
            },
            additionalNotes: {
              type: "string",
              example: "Patient should monitor blood pressure daily",
            },
          },
        },
        Bill: {
          type: "object",
          required: ["doctorId", "appointmentId", "amount", "paymentMethod"],
          properties: {
            doctorId: {
              type: "string",
              description: "Reference to Doctor model",
              example: "507f1f77bcf86cd799439011",
            },
            appointmentId: {
              type: "string",
              description: "Reference to Appointment model",
              example: "507f1f77bcf86cd799439012",
            },
            amount: {
              type: "number",
              description: "Total bill amount",
              minimum: 0,
              example: 2500,
            },
            isBaseAdded: {
              type: "boolean",
              default: false,
              description: "Whether base amount is added",
            },
            discount: {
              type: "number",
              default: 0,
              description: "Discount amount",
              minimum: 0,
              example: 200,
            },
            paymentMethod: {
              type: "string",
              enum: ["cash", "card", "upi", "insurance"],
              example: "card",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["amount", "description"],
                properties: {
                  amount: {
                    type: "number",
                    example: 1500,
                  },
                  description: {
                    type: "string",
                    example: "Consultation fee",
                  },
                },
              },
            },
            isPaid: {
              type: "boolean",
              default: false,
            },
            notes: {
              type: "string",
              example: "Payment received via credit card",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            phoneNo: {
              type: "string",
              required: true,
              example: "9876543210",
            },
            appointments: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of appointment IDs",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message description",
            },
            error: {
              type: "string",
              example: "Detailed error information",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Doctors",
        description: "Doctor management operations",
      },
      {
        name: "Appointments",
        description: "Appointment booking and management",
      },
      {
        name: "Prescriptions",
        description: "Prescription management",
      },
      {
        name: "Bills",
        description: "Billing and payment management",
      },
      {
        name: "Dashboard",
        description: "Dashboard and analytics",
      },
      {
        name: "Email Testing",
        description: "Test email functionality",
      },
    ],
  },
  apis: ["./routes/*.js", "./controller/*.js", "./controller/admin/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
