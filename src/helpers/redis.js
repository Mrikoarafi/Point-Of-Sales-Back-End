const {success,
    successWithMeta
} = require('../helpers/response')
const redis = require('redis')
const _ = require('lodash')
const redisClient = redis.createClient()

//fungsi redis ketika pertama kali dia akan mengambil data dari database dan menyimpan di storage,kemudian tidak mengambil data jika data yang ingin di tampilkan sama.
module.exports = {
    getProduks: (req, res, next) => {
        redisClient.get('produk', (err, data) => {
            if (data) {
                const name = !req.query.name ? null : req.query.name
                const sortField = !req.query.sortField ? 'id' : req.query.sortField
                const sortType = !req.query.sortType ? 'DESC' : req.query.sortType
                const limit = !req.query.limit ? 10 : parseInt(req.query.limit)
                const page = !req.query.page ? 1 : parseInt(req.query.page)
                const start = page === 1 ? 0 : (page * limit) - limit
                const offset = start === 0 ? limit : start * limit
                //sort
                let results = JSON.parse(data);
                const sort = _.orderBy(results, [sortField], [sortType])
                let dataRedis = sort
                //pagination
                if (name!==null) {
                    const searching = sort.filter(e => e.nameproduk.toLowerCase().includes(name.toLowerCase()))
                    dataRedis=searching
                }
                const countData = {
                    totalRows : dataRedis.length,
                    totalPages: Math.ceil(dataRedis.length/limit),
                    page,
                }
                const result= dataRedis.slice(start,offset)
                successWithMeta(res,result, countData, 'Get produk from redis') // di ubah ke json              
            } else {
                next()
            }
        })
    },
    // getProduksRedis: (req, res, next) => {
    //     redisClient.get('produkDetails', (err, data) => {
    //         if (data) {
    //             success(res, JSON.parse(data), 'Get produk details from redis') // di ubah ke json              
    //         } else {
    //             next()
    //         }
    //     })
    // },
    // updateProduk: (req, res, next) => {
    //     redisClient.get('updateProduk', (err, data) => {
    //         if (data) {
    //             success(res, JSON.parse(data), 'Update produk from redis') // di ubah ke json              
    //         } else {
    //             next()
    //         }
    //     })
    // },
    // getHistory: (req, res, next) => {
    //     redisClient.get('history', (err, data) => {
    //         if (data) {
    //             success(res, JSON.parse(data), 'Get history from redis') // di ubah ke json              
    //         } else {
    //             next()
    //         }
    //     })
    // },
    getCategory: (req, res, next) => {
        redisClient.get('category', (err, data) => {
            if (data) {
                const name = !req.query.name ? null : req.query.name;
                const orderBy = !req.query.orderBy ? 'id' : req.query.orderBy;
                const sort = !req.query.sort ? 'DESC' : req.query.sort;
                let jmlhDataPerhalaman = !req.query.limit ?  10 : parseInt(req.query.limit);
                let pagesActive = !req.query.pages ? 1 : parseInt(req.query.pages);
                const startIndex = (pagesActive - 1) * jmlhDataPerhalaman;
                const endIndex = pagesActive * jmlhDataPerhalaman;
                // Pagination
                let results = JSON.parse(data);
                const sorting = _.orderBy(results,[orderBy],[sort])
                    let dataRedis = sorting
                    if (name!==null) {
                        const searching = sorting.filter(e => e.nameproduk.toLowerCase().includes(name.toLowerCase()))
                        dataRedis=searching
                    }
                    const countData = {
                        totalRows : dataRedis.length,
                        totalPages: Math.ceil(dataRedis.length/jmlhDataPerhalaman),
                        pagesActive,
                    }
                    const result= dataRedis.slice(startIndex,endIndex)
                    successWithMeta(res,result,countData,'Get All Category from Redis Success')
            }else{
                next()
            }
        })
    }
}