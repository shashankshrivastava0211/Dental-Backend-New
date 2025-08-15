"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createDoctor_1 = require("../controller/admin/createDoctor");
const router = express_1.default.Router();
router.post("/doctors", createDoctor_1.createDoctor);
exports.default = router;
