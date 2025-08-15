"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardData = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const moment_1 = __importDefault(require("moment"));
const dashboardData = async (_req, res) => {
    try {
        const today = (0, moment_1.default)().format("DD/MM/YYYY");
        const startOfWeek = (0, moment_1.default)().startOf("isoWeek").format("DD/MM/YYYY");
        const startOfMonth = (0, moment_1.default)().startOf("month").format("DD/MM/YYYY");
        const allAppointments = await appointment_1.default.find();
        const totalAppointments = allAppointments.length;
        const completedAppointments = allAppointments.filter((appt) => appt.status === "completed").length;
        const pendingAppointments = allAppointments.filter((appt) => appt.status === "pending").length;
        const dailyPatients = allAppointments.filter((appt) => appt.date === today).length;
        const weeklyPatients = allAppointments.filter((appt) => (0, moment_1.default)(appt.date, "DD/MM/YYYY").isSameOrAfter(startOfWeek) &&
            (0, moment_1.default)(appt.date, "DD/MM/YYYY").isSameOrBefore((0, moment_1.default)())).length;
        const monthlyPatients = allAppointments.filter((appt) => (0, moment_1.default)(appt.date, "DD/MM/YYYY").isSameOrAfter(startOfMonth) &&
            (0, moment_1.default)(appt.date, "DD/MM/YYYY").isSameOrBefore((0, moment_1.default)())).length;
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
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Erro");
    }
};
exports.dashboardData = dashboardData;
