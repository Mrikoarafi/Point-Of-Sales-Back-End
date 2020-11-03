//KONEKSI KE DATABASE
const db = require("../../configs/db");


const history = {
    getAll: (date, sort, typesort, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *,(SELECT COUNT(*) FROM history )AS count FROM history WHERE date LIKE '%${date}%' ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        });
    },
}
module.exports = history;