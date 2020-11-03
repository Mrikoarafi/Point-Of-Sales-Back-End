//LOGIC
const transaksiModel = require("../../models/v1/transaksi");
const {
    success,
} = require("../../helpers/response")

const transaksi = {
    insert: async (req, res) => {
        const body = req.body
        transaksiModel.insertMaster(body).then((response) => {
            const idMaster = response.insertId
            const insertDetail = body.detail.map((item) => {
                item.id_transaksi = idMaster
                transaksiModel.insertDetail(item)
            })
            Promise.all(insertDetail).then(() => {
                success(res, response, 'Insert transaksi Success')
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    }
}

module.exports = transaksi;