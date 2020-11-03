//LOGIC
const historyModel = require("../../models/v1/history");
const {
    successWithMeta,
    failed
} = require("../../helpers/response")
const redis = require('redis')
const redisClient = redis.createClient()


const history = {
    getAll: (req, res) => {
        const sort = !req.query.sort ? `'%%'` : req.query.sort
        const typesort = !req.query.typesort ? '' : req.query.typesort
        const date = !req.query.date ? '' : req.query.date
        //search limit & page
        const limit = !req.query.limit ? 2 : parseInt(req.query.limit)
        const page = !req.query.limit ? 1 : parseInt(req.query.page)
        const offset = page === 1 ? 0 : (page - 1) * limit
        historyModel
            .getAll(date, sort, typesort, limit, offset)
            .then((result) => {
                // redisClient.set('history', JSON.stringify(result))
                //hitung rows
                const totalRows = result[0].count
                const meta = {
                    totalRows,
                    //math ceil untuk membulatkan angka
                    totalPage: Math.ceil(totalRows / limit),
                    page
                }
                successWithMeta(res, result, meta, 'Get all history success,from Database')
            })
            .catch((err) => {
                failed(res, [], err.message)
            });
    }
}
module.exports = history;