"use strict";
const express = require("express");
const Router = express.Router();
const md5 = require("md5");
const uuidTokenGenerator = require("uuid-token-generator");
const TokenGenerator = new uuidTokenGenerator();
const dbWrapper = require("../models/dbWrapper");
const replyFunc = require("../models/replyFunction");
const R = require("../models/dbWrapper").getDB();

Router.post("/signup", (request, reply) => {
    const userDetails = request.body;

    getUserDetails(userDetails).then((response) => {
        if (response) {
            return replyFunc.replyFunction(409, "User already exists", reply);
        }
        const data = {
            "authenticationToken": generateToken(userDetails.username)
        };
        addNewUser(userDetails).then((response) => {
            let doc = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                username: userDetails.username,
                password: userDetails.password,
                emailId: userDetails.emailId
            }
            let key = `myGooglePlaces::user::${userDetails.username}`
            dbWrapper.redisSet(key, doc).then((results) => {
                return replyFunc.replyFunction(200, results, reply);
            })
        })
    }).catch((error) => {
        return replyFunc.replyFunction(500, "Error while fetching user details", reply);
    });
});

function getUserDetails(userDetails) {
    const username = userDetails.username;
    return new Promise((resolve, reject) => {
        R.db.redis.hget(username, "password").then(resolve).catch(reject);
    });
}

function addNewUser(userDetails) {
    const username = userDetails.username;
    // delete userDetails.username;
    userDetails.password = md5(userDetails.password);

    return new Promise((resolve, reject) => {
        R.db.redis.hmset(username, userDetails).then(resolve).catch(reject);
    });
}


function generateToken(username) {
    const ssotoken = TokenGenerator.generate();
    const transaction = R.db.redis.multi();
    transaction.set(ssotoken, username);
    transaction.expire(ssotoken, 864000);
    transaction.exec().catch(console.error);
    return ssotoken;
}

Router.post("/login", (request, reply) => {
    const userDetails = request.body;
    const password = md5(userDetails.password);

    getUserDetails(userDetails).then((response) => {
        if (!response) {
            return replyFunc.replyFunction(401, "Invalid credentials", reply);
        }
        if (response !== password) {
            return replyFunc.replyFunction(401, "Invalid credentials", reply);
        }
        const data = {
            "ssotoken": generateToken(userDetails.username)
        };
        let doc = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            username: userDetails.username,
            password: userDetails.password,
            emailId: userDetails.emailId,
            ssotoken: data.ssotoken
        }
        let key = `myGooglePlaces::user::${userDetails.username}`;
        dbWrapper.redisGet(key).then((docGet) => {
            dbWrapper.redisSet(key, doc).then((results) => {
                console.log("-=-=-=-=-=-=-=-=-=- : ",data);
                return replyFunc.replyFunction(200, data, reply);
            })
        })
    }).catch((error) => {
        return replyFunc.replyFunction(500, "Error while fetching user details", reply);
    });
});

function invalidatessotoken(data) {
    const ssotoken = data.ssotoken;
    return new Promise((resolve, reject) => {
        return R.db.redis.del(ssotoken).then(resolve).catch(reject);
    });
}

Router.get("/logout", (request, reply) => {
    const username = request.headers.username;
    const ssotoken = request.headers.ssotoken;
    const data = {
        "ssotoken": ssotoken
    };
    invalidatessotoken(data).then((response) => {
        if (!response) {
            return replyFunc.replyFunction(401, "ssotoken Invalid", reply);
        }
        return replyFunc.replyFunction(204, "No Data", reply);
    }).catch((reject) => {
        return replyFunc.replyFunction(500, "Error while invalidating ssotoken", reply);
    });
});

module.exports = Router;
