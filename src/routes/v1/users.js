//koneksikan ke mysql
//http://localhost:3000/api/v1/produk/getall?sort=nameproduk

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