const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads')
    },
    filename: (req, file, cb) => {
		const ekstensi = file.originalname.split('.');
		cb(null, `${file.fieldname}-${Date.now()}.${ekstensi[1]}`);
	}
})
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(jpg|png)\b/)) {
            callback(null, true)
        } else {
            callback('Image type must jpg or png', null)
        }
    }
})

module.exports = upload