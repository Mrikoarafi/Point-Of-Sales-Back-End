//koneksikan ke mysql
const express = require("express");
const {
    categoryAll,
    selectCategory
} = require("../../controllers/v1/category");
const {
    author,
    authen
} = require('../../helpers/auth')
const router = express.Router();
// const redis = require('../../helpers/redis')
router
    .get("/getAll", author, authen,  categoryAll)
    .get("/getCategory", authen, authen, selectCategory);

module.exports = router;