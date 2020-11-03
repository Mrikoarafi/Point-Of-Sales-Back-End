const express = require("express");
const transaksiCoi = require("../../controllers/v1/transaksi");
const router = express.Router();


router
    .post("/insert", transaksiCoi.insert)


module.exports = router;