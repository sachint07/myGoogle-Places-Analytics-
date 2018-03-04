// Require DB

const Redis = require("ioredis");
//const mongoose = require("mongoose");

// Runtime Variable

let R = {
	"db": {}
};


module.exports = {
	"init": init,
	"redisGet": redisGet,
	"redisSet": redisSet,
	"redisDel": redisDel,
	"getDB": getDB
};


// Connect DB

function init(dbConfiguration) {
	R.db.redis = new Redis(dbConfiguration.redis);
	// mongoose.Promise = global.Promise;
	// mongoose.connect("mongodb://localhost:27017/myGooglePlaces");
	//R.db.redis  = redis.createClient(dbConfiguration.redis);
}

//GET DB

function getDB() {
	return R;
}


//GET in redis

function redisGet(key) {
	return new Promise((resolve, reject) => {
		R.db.redis.get(key, (err, res) => {
			if (err) {
				let obj = {
					code: 500,
					message: "unable to get doc in redis",
					dbRes: err.message
				};
				return reject(obj);
			} else {
				let obj = {
					code: 200,
					message: "success",
					dbRes: res
				};
				return resolve(obj);
			}
		});
	})
}

//SET in redis

function redisSet(key, value) {
	return new Promise((resolve, reject) => {
		R.db.redis.set(key, JSON.stringify(value), (err, res) => {
			if (err) {
				let obj = {
					code: 500,
					message: "unable to set doc in redis",
					dbRes: err.message
				};
				return reject(obj);
			} else {
				let obj = {
					code: 200,
					message: "success",
					dbRes: res
				};
				return resolve(obj);
			}
		});
	});
}

//DELETE in redis

function redisDel(key) {
	return new Promise((resolve, reject) => {
		R.db.redis.del(key, (err, res) => {
			if (err) {
				let obj = {
					code: 500,
					message: "unable to del doc in redis",
					dbRes: err.message
				};
				return reject(obj);
			} else {
				let obj = {
					code: 200,
					message: "success",
					dbRes: res
				};
				return resolve(obj);
			}
		});
	});
}
