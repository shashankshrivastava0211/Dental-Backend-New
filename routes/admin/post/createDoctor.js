const express = require("express");
const { createDoctor } = require("../../../controller/admin/createDoctor");
const router = express.Router();

router.post("/createDoctor", createDoctor);

module.exports = router;
