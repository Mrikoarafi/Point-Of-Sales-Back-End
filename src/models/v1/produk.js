//KONEKSI KE DATABASE
const db = require("../../configs/db");
const fs = require('fs');
const path = require('path'); 
const produk = {
    getAll: (name, sort, typesort, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *,(SELECT COUNT(*) FROM produk )AS count FROM produk WHERE nameproduk LIKE '%${name}%' ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        });
    },
    produkDetails: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM produk WHERE id_product = ${id}`,
                (err, result) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    insert: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO produk (nameproduk,price,image,id_category) 
            VALUES ('${data.nameproduk}','${data.price}','${data.image}','${data.id_category}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM produk WHERE id_product='${id}'`,
                (err, result) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        let oldImage = result[0].image;
                        let newImage = data.image;
                        if (!newImage) {
                            db.query(`UPDATE produk SET 
                                id_category  = '${data.id_category}',
                                nameproduk = '${data.nameproduk}',
                                price = '${data.price}',
                                image = '${oldImage}'
                                WHERE id_product     = '${id}'`,
                                (err, result) => {
                                    if (err) {
                                        reject(new Error(err))
                                    } else {
                                        resolve(result);
                                    }
                                })
                        } else {
                            let oldPath = path.join(__dirname + `/../../uploads/${result[0].image}`);
                            fs.unlink(oldPath, function (err) {
                                if (err) throw err;
                            })
                            db.query(`UPDATE produk SET 
                                id_category  = '${data.id_category}',
                                nameproduk = '${data.nameproduk}',
                                price = '${data.price}',
                                image = '${data.image}'
                                WHERE id_product = '${id}'`,
                                (err, result) => {
                                    if (err) {
                                        reject(new Error(err))
                                    } else {
                                        resolve(result);
                                    }
                                })
                        }
                    }
                })
        })
    },
    updatePatch: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM produk WHERE id_product = ${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    if (!data.image) {
                        data.image = result[0].image;
                        db.query(`UPDATE produk SET ? WHERE id_product = ?`, [data, id], (err, result) => {
                            if (err) {
                                reject(new Error(err))
                            } else {
                                resolve(result);
                            }
                        })
                    } else {
                        let oldPath = path.join(__dirname + `/../../uploads/${result[0].image}`);
                        fs.unlink(oldPath, function (err) {
                            if (err) throw err;
                        })
                        db.query(`UPDATE produk SET ? WHERE id_product = ?`, [data, id], (err, result) => {
                            if (err) {
                                reject(new Error(err))
                            } else {
                                resolve(result);
                            }
                        })
                    }

                }
            })
        })
    },
    destroy: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM produk WHERE id_product=${id}`,
                (err, result) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        // Delete Image
                        let filepath = path.join(__dirname + `/../../uploads/${result[0].image}`)
                        fs.unlink(filepath, function (err) {
                            if (err) {
                                throw err
                            } else {
                            }
                        })
                        // Query DELETE
                        db.query(`DELETE  FROM produk WHERE id_product=${id} `,
                            (err, result) => {
                                if (err) {
                                    reject(new Error(err));
                                } else {
                                    resolve(result);
                                }
                            })
                    }
                })
        })
    }
}
module.exports = produk;