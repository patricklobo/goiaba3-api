/**
 * Module Dependencies
 */
const config = require('./index');
const init = require('./init');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');

/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.name,
	version: config.version,
});

/**
  * Middleware
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

function unknownMethodHandler(req, res) {
    if (req.method.toLowerCase() === 'options') {
        console.log('received an options method request');
      var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization', 'token', 'empresa']; // added Origin & X-Requested-With & **Authorization**
  
      if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
  
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
      res.header('Access-Control-Allow-Methods', res.methods.join(', '));
      res.header('Access-Control-Allow-Origin', req.headers.origin);
  
      return res.send(200);
    }
    else
      return res.send(400);
  }
  
  server.on('MethodNotAllowed', unknownMethodHandler);

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {
	    require('../routes')(server);
	    console.log(`Server is listening on port ${config.port}`);
    });
    init();
});