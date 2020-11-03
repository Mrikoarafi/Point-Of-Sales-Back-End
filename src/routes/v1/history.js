const express = require('express');
const { getAll } = require('../../controllers/v1/history');
const { author, authen } = require('../../helpers/auth');
const redis = require('../../helpers/redis');

const router = express.Router();

router.get('/getAll', author, authen, getAll);

module.exports = router;
