import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger";
import appointmentRouter from "./routes/appointment";
import prescriptionRouter from "./routes/prescription";
import emailTestRouter from "./routes/emailTest";
import adminRouter from "./routes/admin";
import morgan from "morgan";
import dashboardRouter from "./routes/dashboard";
import bill from "./routes/bill";
import dotenv from "dotenv";

dotenv.config();
require("./config/db.js");
require("./config/db");

const app = express();

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
  swaggerUi.setup(swaggerSpecs as any, {
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
app.use("/api/v1", appointmentRouter as any);
app.use("/api/v1", prescriptionRouter as any);
app.use("/api/v1", dashboardRouter as any);
app.use("/api/v1/bill", bill as any);
app.use("/api/v1/email-test", emailTestRouter as any);
app.use("/api/v1/admin", adminRouter as any);

app.listen(3000, () => console.log("Server started on port 3000"));
