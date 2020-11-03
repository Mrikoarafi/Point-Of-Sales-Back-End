//LOGIC
const produkModel = require('../../models/v1/produk');
const { success, failed, successWithMeta } = require('../../helpers/response');
const upload = require('../../helpers/upload');
const redis = require('redis');
const redisClient = redis.createClient();

const produk = {
	getAll: (req, res) => {
		const sort = !req.query.sort ? `'%%'` : req.query.sort;
		const typesort = !req.query.typesort ? '' : req.query.typesort;
		const name = !req.query.name ? '' : req.query.name;
		//search limit & page
		const limit = !req.query.limit ? 9 : parseInt(req.query.limit);
		const page = !req.query.limit ? 1 : parseInt(req.query.page);
		const offset = page === 1 ? 0 : (page - 1) * limit;
		produkModel
			.getAll(name, sort, typesort, limit, offset)
			.then(result => {
				// redisClient.set('produk', JSON.stringify(result)) // kirim dan tampilin ke teks dulu karna redis berupa teks
				const totalRows = result[0].count; //hitung rows
				const meta = {
					totalRows,
					//math ceil untuk membulatkan angka
					totalPage: Math.ceil(totalRows / limit),
					page
				};
				successWithMeta(res, result, meta, 'Get all books success,from Database');
			})
			.catch(err => {
				failed(res, [], err.message);
			});
	},
	produkDetails: (req, res) => {
		try {
			const name = req.params.name;
			produkModel
				.produkDetails(name)
				.then(result => {
					// redisClient.set('produkDetails', JSON.stringify(result))
					success(res, result, 'Search name produk Success');
				})
				.catch(err => {
					failed(res, [], err.message);
				});
		} catch (error) {
			failed(res, [], 'Internal server error');
		}
	},
	insert: (req, res) => {
		upload.single('image')(req, res, err => {
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					failed(res, [], 'Ukuran file terlalu besar');
				} else {
					failed(res, [], err);
				}
			} else {
				const body = req.body;
				body.image = req.file.filename;
				produkModel
					.insert(body)
					.then(result => {
						redisClient.del('produk');
						success(res, result, 'Insert produk Success');
					})
					.catch(err => {
						failed(res, [], err.message);
					});
				}
		});
	},
	update: (req, res) => {
		upload.single('image')(req, res, async err => {
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					failed(res, [], 'Ukuran file terlalu besar');
				} else {
					failed(res, [], err);
				}
			} else {
				try {
					const id = req.params.idupdate;
					const body = req.body;
					body.image = req.file.filename;
					produkModel
						.update(body, id)
						.then(result => {
							redisClient.del('produk');
							success(res, result, 'Update produk Success');
						})
						.catch(err => {
							failed(res, [], err.message);
						});
				} catch (error) {
					error(res, [], error.message);
				}
			}
		});
	},
	updatePatch: (req, res) => {
		upload.single('image')(req, res,async err => {
			if(err){
				if (err.code === 'LIMIT_FILE_SIZE') {
					failed(res, [], 'Ukuran file terlalu besar');
				} else {
					failed(res, [], err);
				}
			}else{
				try {
					const id = req.params.idupdate;
					const body = req.body;
					body.image = !req.file ? req.file : req.file.filename;
					produkModel
						.updatePatch(body, id)
						.then(result => {
							redisClient.del('produk');
							success(res, result, 'Update produk Success');
						})
						.catch(err => {
							failed(res, [], err.message);
						});
				} catch (error) {
					error(res, [], error.message);
				}
			}
			
		});
	},
	destroy: (req, res) => {
		try {
			const id = req.params.iddestroy;
			produkModel
				.destroy(id)
				.then(result => {
					redisClient.del('produk');
					success(res, result, 'Delete produk Success');
				})
				.catch(err => {
					failed(res, [], err.message);
				});
		} catch (error) {
			failed(res, [], 'Internal server error');
		}
	}
};
module.exports = produk;
