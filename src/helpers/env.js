require('dotenv').config();

const env = {
	PORT: process.env.PORT,
	JWTSECRET: process.env.JWTSECRET,
	database: process.env.database,
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	emailCom: process.env.emailCom,
	emaillpassword: process.env.emailpassword,
	urlAWS: process.env.urlAWS,
	urlFrontend: process.env.urlFrontEnd,
	JWTREGISTER: process.env.JWTREGIS,
	urlVerify: process.env.urlVerify
};

module.exports = env;
