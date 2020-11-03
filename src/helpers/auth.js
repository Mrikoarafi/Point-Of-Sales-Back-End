const jwt = require('jsonwebtoken')
const {
    tokenResult,tokenResultErr,tokenResultExpired
} = require("../helpers/response")
const {
    JWTSECRET
} = require('../helpers/env')

module.exports = {
    authen: (req, res, next, decoded) => {
        const token = req.headers.token
        if (token === undefined || token === '') {
            tokenResult(res, [], 'Token harus di isi')
        } else {
            next()
        }
    },
    author: (req, res, next) => {
        const token = req.headers.token
        jwt.verify(token, JWTSECRET, (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                tokenResultExpired(res, [], 'Token Expired,Authentikasi GAGAL!')
            } else if (err && err.name === 'JsonWebTokenError') {
                tokenResultErr(res, [], 'Token Salah,Authentikasi GAGAL!')
            } else {
                next()
            }
        })
    }
}