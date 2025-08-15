"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const appointmentSchema = new mongoose_1.Schema({
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 13,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return ((0, moment_1.default)(value, "DD/MM/YYYY", true).isValid() &&
                    (0, moment_1.default)(value, "DD/MM/YYYY").isSameOrAfter((0, moment_1.default)().startOf("day")));
            },
            message: "Date must be in 'DD/MM/YYYY' format and today or in the future.",
        },
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]?[0-9]|2[0-3])$/.test(value);
            },
            message: "Time must be in 'HH' format (24-hour clock).",
        },
    },
    description: { type: String, trim: true, maxlength: 200 },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "others"],
    },
    age: { type: Number, required: true, min: 1, max: 120 },
    prescriptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Prescription",
        default: null,
    },
    billID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bill", default: null },
}, { timestamps: true });
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
const AppointmentModel = mongoose_1.default.models.Appointment ||
    mongoose_1.default.model("Appointment", appointmentSchema);
exports.default = AppointmentModel;
