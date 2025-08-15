import express from "express";
import {
  createBill,
  updateBill,
  billController,
} from "../controller/billController";

const bill = express.Router();

bill.get("/", billController as any);
bill.post("/", createBill as any);
bill.put("/:billId", updateBill as any);

export default bill;
