const redis = require('redis');
const R = {
	"db": {}
};

module.exports = {
	"init": init
};

function init(dbConfiguration) {
    R.db.redis = redis.createClient(dbConfiguration.redis);
    console.log("Redis Connected ");
}

