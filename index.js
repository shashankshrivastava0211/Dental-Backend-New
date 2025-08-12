const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const appointmentRouter = require("./routes/appointment.js");
const prescriptionRouter = require("./routes/prescription.js");
const emailTestRouter = require("./routes/emailTest.js");
const adminRouter = require("./routes/admin.js");
const app = express();
const morgan = require("morgan");
const dashboardRouter = require("./routes/dashboard.js");
const bill = require("./routes/bill.js");
require("dotenv").config();
require("./config/db.js");

// app.use(
//   cors({
//     origin: "http://localhost:3001",
//   })
// );

app.use(cors());

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Healthcare API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      docExpansion: "list",
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  })
);

// API Routes
app.use("/api/v1", appointmentRouter);
app.use("/api/v1", prescriptionRouter);
app.use("/api/v1", dashboardRouter);
app.use("/api/v1/bill", bill);
app.use("/api/v1/email-test", emailTestRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(3000, () => console.log("Server started on port 3000"));
