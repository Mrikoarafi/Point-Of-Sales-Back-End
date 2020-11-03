const express = require("express");
const usersController = require("../../controllers/v1/users");

const router = express.Router();


router
    .post('/register', usersController.registerCoi)
    .post('/login', usersController.login)
    .post('/refresh-token', usersController.renewToken)
    .post('/send-email', usersController.resetPassword)
    .post('/ubah-pass', usersController.confirmPass)
    .get('/verify/:token', usersController.verify)


module.exports = router;