import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Healthcare Appointment Booking API",
      version: "1.0.0",
      description:
        "A comprehensive API for managing doctor appointments, prescriptions, bills, and patient data in a multi-doctor subscription system.",
      contact: { name: "API Support", email: "support@healthcare.com" },
      license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
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
    components: {},
    tags: [],
  },
  apis: [
    "./routes/*.ts",
    "./controller/*.ts",
    "./controller/admin/*.ts",
    "./routes/*.js",
    "./controller/*.js",
    "./controller/admin/*.js",
  ],
} as any;

const specs = swaggerJsdoc(options);
export default specs;
