"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billController_1 = require("../controller/billController");
const bill = express_1.default.Router();
bill.get("/", billController_1.billController);
bill.post("/", billController_1.createBill);
bill.put("/:billId", billController_1.updateBill);
exports.default = bill;
