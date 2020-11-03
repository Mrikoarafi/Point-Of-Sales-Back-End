//KONEKSI KE DATABASE
const db = require("../../configs/db");

const produk = {
    insertMaster: (body) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO transaksi (invoice,cashier) VALUES ('${body.invoice}','${body.cashier}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    insertDetail: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO transaksi_detail SET ?`,
                data, (err, result) => {
                    if (err) {
                        reject(new Error(err))
                    } else {
                        resolve(result)
                    }
                })
        })
    }
}
module.exports = produk;