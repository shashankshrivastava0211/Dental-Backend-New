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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DrSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    consultationFee: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    availability: {
        type: String,
        required: true,
        enum: ["Available", "Busy", "Unavailable", "On Leave"],
    },
    workingHours: {
        startTime: { type: String, required: true, default: "09:00" },
        endTime: { type: String, required: true, default: "17:00" },
        workingDays: {
            type: [String],
            required: true,
            default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
    },
    location: {
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
    },
    mobileNumber: { type: String, required: true, trim: true },
    email: { unique: true, type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
DrSchema.index({ specialization: 1, location: 1, isActive: 1 });
const DoctorModel = mongoose_1.default.models.Doctor ||
    mongoose_1.default.model("Doctor", DrSchema);
exports.default = DoctorModel;
