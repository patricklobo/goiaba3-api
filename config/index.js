module.exports = {
    secret: 'lobodevelopers2018_',
	name: 'API',
	version: '1.0',
	perfil_master: "Adm Geral",
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	base_url: process.env.BASE_URL || 'http://localhost:3000',
	db: {
		uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apimodelo',
	},
};