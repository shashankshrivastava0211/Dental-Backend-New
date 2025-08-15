"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const appointment_1 = __importDefault(require("./routes/appointment"));
const prescription_1 = __importDefault(require("./routes/prescription"));
const emailTest_1 = __importDefault(require("./routes/emailTest"));
const admin_1 = __importDefault(require("./routes/admin"));
const morgan_1 = __importDefault(require("morgan"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const bill_1 = __importDefault(require("./routes/bill"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./config/db.js");
require("./config/db");
const app = (0, express_1.default)();
// app.use(
//   cors({
//     origin: "http://localhost:3001",
//   })
// );
app.use((0, cors_1.default)());
//middlewares
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger Documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Healthcare API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        docExpansion: "list",
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
    },
}));
// API Routes
app.use("/api/v1", appointment_1.default);
app.use("/api/v1", prescription_1.default);
app.use("/api/v1", dashboard_1.default);
app.use("/api/v1/bill", bill_1.default);
app.use("/api/v1/email-test", emailTest_1.default);
app.use("/api/v1/admin", admin_1.default);
app.listen(3000, () => console.log("Server started on port 3000"));
