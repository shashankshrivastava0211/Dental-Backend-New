import express from "express";
import { createDoctor } from "../../../controller/admin/createDoctor";
const router = express.Router();

router.post("/createDoctor", createDoctor as any);

export default router;
