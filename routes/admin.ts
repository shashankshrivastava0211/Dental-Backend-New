import express from "express";
import { createDoctor } from "../controller/admin/createDoctor";

const router = express.Router();

router.post("/doctors", createDoctor as any);

export default router;
