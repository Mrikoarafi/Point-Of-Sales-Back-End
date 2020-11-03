//koneksikan ke mysql
//http://localhost:3000/api/v1/produk/getall?sort=nameproduk

const express = require("express");
const {
    getAll,
    produkDetails,
    insert,
    update,
    destroy,
    updatePatch
} = require("../../controllers/v1/produk");
const {
    author,
    authen
} = require('../../helpers/auth')
const router = express.Router();
const redis = require('../../helpers/redis')

router
    .get("/getall", author, authen, redis.getProduks, getAll)
    .get("/produkDetails/:name", author, authen, produkDetails)
    .post("/insert", author, authen, insert)
    .put("/update/:idupdate", author, authen, update)
    .patch("/update/:idupdate", author, authen, updatePatch)
    .delete("/delete/:iddestroy", author, authen, destroy)


module.exports = router;