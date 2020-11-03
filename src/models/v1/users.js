//KONEKSI KE DATABASE
const db = require('../../configs/db');

const users = {
    register: (data) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO users (email,password,status_aktivasi) VALUES ('${data.email}','${data.password}', 0)`,
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
    login: data => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM users WHERE email ='${data.email}'`,
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
    updateRefreshToken: (token, id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET refreshToken='${token}' WHERE id='${id}'`,
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
    checkRefreshToken: refreshToken => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM users WHERE refreshToken='${refreshToken}'`,
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
    resetPass: email => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        });
    },
    updateKeyReset: (key, email) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET key_resetpassword ='${key}' WHERE email='${email}'`,
                (err, result) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve();
                    }
                }
            );
        });
    },
    ubahPassword: (password, key) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET password='${password}', key_resetpassword=null WHERE key_resetpassword='${key}'`,
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
    aktifasiSuccess: email => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET status_aktivasi=1 WHERE email='${email}'`,
                (err, success) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(success);
                    }
                }
            );
        });
    }
};
module.exports = users;
