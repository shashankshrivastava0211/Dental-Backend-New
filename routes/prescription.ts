import express from "express";
import {
  prescription,
  updatePrescription,
  getPrescriptionByAppointmentId,
  loginAdmin,
} from "../controller/prescriptionController";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/prescription", prescription as any);
prescriptionRouter.get("/prescription", getPrescriptionByAppointmentId as any);
prescriptionRouter.patch(
  "/prescription/:prescriptionId",
  updatePrescription as any
);
prescriptionRouter.post("/login", loginAdmin as any);

export default prescriptionRouter;
