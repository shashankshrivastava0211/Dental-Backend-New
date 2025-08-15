import express from "express";
import { dashboardData } from "../controller/dashboardController";
const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", dashboardData as any);
export default dashboardRouter;
