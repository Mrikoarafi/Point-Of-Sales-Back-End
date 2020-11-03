//LOGIC
const categoryModel = require("../../models/v1/category");
const {
    successWithMeta,
    success,
    failed
} = require("../../helpers/response")
const redis = require('redis')
const redisClient = redis.createClient()


const category = {
    categoryAll: (req, res) => {
        categoryModel
            .getAllModels()
            .then((result) => {
                success(res, result, 'Get category success,from Database')
            })
            .catch((err) => {
                failed(res, [], err.message)
            });
    },
    selectCategory: (req, res) => {
        const name = !req.query.name ? '' : req.query.name
        //search limit & page
        const limit = !req.query.limit ? 4 : parseInt(req.query.limit)
        const page = !req.query.limit ? 1 : parseInt(req.query.page)
        const offset = page === 1 ? 0 : (page - 1) * limit
        categoryModel
            .selectCategoryModels(name, limit, offset)
            .then((result) => {
                redisClient.set('category', JSON.stringify(result))
                //hitung rows
                const hitungData = result[0].count
                const meta = {
                    totalRows: hitungData,
                    //math ceil untuk membulatkan angka
                    totalPage: Math.ceil(hitungData / limit),
                    page
                }
                successWithMeta(res, result, meta, 'Get category success,from Database')
            })
            .catch((err) => {
                failed(res, [], err.message)
            });
    }

}
module.exports = category;