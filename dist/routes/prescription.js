"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prescriptionController_1 = require("../controller/prescriptionController");
const prescriptionRouter = express_1.default.Router();
prescriptionRouter.post("/prescription", prescriptionController_1.prescription);
prescriptionRouter.get("/prescription", prescriptionController_1.getPrescriptionByAppointmentId);
prescriptionRouter.patch("/prescription/:prescriptionId", prescriptionController_1.updatePrescription);
prescriptionRouter.post("/login", prescriptionController_1.loginAdmin);
exports.default = prescriptionRouter;
