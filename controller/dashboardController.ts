import { Request, Response } from "express";
import Appointment from "../models/appointment";
import moment from "moment";

export const dashboardData = async (_req: Request, res: Response) => {
  try {
    const today = moment().format("DD/MM/YYYY");
    const startOfWeek = moment().startOf("isoWeek").format("DD/MM/YYYY");
    const startOfMonth = moment().startOf("month").format("DD/MM/YYYY");

    const allAppointments = await Appointment.find();

    const totalAppointments = allAppointments.length;
    const completedAppointments = allAppointments.filter(
      (appt: any) => appt.status === "completed"
    ).length;
    const pendingAppointments = allAppointments.filter(
      (appt: any) => appt.status === "pending"
    ).length;

    const dailyPatients = allAppointments.filter(
      (appt: any) => appt.date === today
    ).length;

    const weeklyPatients = allAppointments.filter(
      (appt: any) =>
        moment(appt.date, "DD/MM/YYYY").isSameOrAfter(startOfWeek) &&
        moment(appt.date, "DD/MM/YYYY").isSameOrBefore(moment())
    ).length;

    const monthlyPatients = allAppointments.filter(
      (appt: any) =>
        moment(appt.date, "DD/MM/YYYY").isSameOrAfter(startOfMonth) &&
        moment(appt.date, "DD/MM/YYYY").isSameOrBefore(moment())
    ).length;

    res
      .status(200)
      .json({
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        dailyPatients,
        weeklyPatients,
        monthlyPatients,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Erro");
  }
};
