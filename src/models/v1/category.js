//KONEKSI KE DATABASE
const db = require("../../configs/db");


const category = {
    getAllModels: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM category`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        });
    },
    selectCategoryModels: (name, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *,(SELECT COUNT(*) FROM produk) AS count FROM produk LEFT JOIN category ON produk.id_category=category.id_category WHERE namecategory LIKE '%${name}%' LIMIT ${offset},${limit} `, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },

}
module.exports = category;