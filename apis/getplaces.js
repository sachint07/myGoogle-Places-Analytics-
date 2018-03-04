"use strict";
const myConsole = console;
const express = require("express");
const Router = express.Router();
const dbWrapper = require("../models/dbWrapper");
const bodyParser = require("body-parser");
const replyFunc = require("../models/replyFunction");
let requestClient = require("request");
const configFile = require("../configFile");
const analytics = require("../utils/analytics");
requestClient = requestClient.defaults({
	proxy: null
});

//Router.use(bodyParser.json());

Router.get("/fetch/:lat/:long/:searchKeyWord", (request, reply) => {

	let { appKey,username } = request.headers;
	let { lat, long, searchKeyWord } = request.params;
	dbWrapper.redisGet(``)
	requestClient.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${configFile.youApiKey}`, (requestClientErr, requestClientRes) => {
		try {
			if (requestClientErr) {
				myConsole.log(`Error of Request 1: ${requestClientErr}`);
			} else {
				let googleDataPlace = JSON.parse(requestClientRes.body);
				let processData = googleDataPlace.results[0].address_components.filter(getPlaceValue);
				const redisDocKey = `myGoogle::places::${processData[0]['long_name']}::${searchKeyWord}`;
				dbWrapper.redisGet(redisDocKey).then((results) => {
					//console.log(results);
					if (results.dbRes != null) {
						console.log("in Local");
						let analyticsData = {
							username:username,
							searchedKeyWord:searchKeyWord,
							lat:lat,
							long:long,
							DB:"Data from Local DB",
							currentLoaction: processData[0]['long_name'],
							status:"Success"
						}
						analytics.analyticsStoreData(analyticsData);
						return replyFunc.replyFunction(200, JSON.parse(results.dbRes), reply);
					}
					getData(searchKeyWord, processData[0]['long_name'], (getDataErr, getDataResponse) => {
						if (getDataErr) {
							return replyFunc.replyFunction(502, requestClientErr, reply);
						} else {
							dbWrapper.redisSet(redisDocKey, getDataResponse).then((results) => {
								let analyticsData = {
									username: username,
									searchedKeyWord: searchKeyWord,
									lat: lat,
									long: long,
									DB: "Google DB",
									currentLoaction: processData[0]['long_name'],
									status: "Success"
								}
								analytics.analyticsStoreData(analyticsData);
								return replyFunc.replyFunction(200, getDataResponse, reply);
							}).catch((e) => {
								return replyFunc.replyFunction(502, requestClientErr, reply);
							})
						}
					});
				}).catch((e) => {
				})
			}
		} catch (e) {
			return replyFunc.replyFunction(502, e, reply);
		}
	});
});

function getPlaceValue(arr) {
	if (arr.types.includes("sublocality_level_1")) {
		return arr;
	}
}

function getData(keyWord, place, callBackGetData) {
	let placesDataToSend = [];
	requestClient.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyWord}+in+${place}&key=${configFile.youApiKey}`, (requestClientgetDataErr, requestClientgetDataRes) => {
		if (requestClientgetDataErr) {
			myConsole.log(`Error of Request : ${requestClientgetDataErr}`);
			return callBackGetData(requestClientgetDataErr, null);
		} else {
			let googlePlacesData = JSON.parse(requestClientgetDataRes.body);
			googlePlacesData.results.map((item) => {
				placesDataToSend.push({
					id: item.id,
					address: item.formatted_address,
					icon: item.icon || null,
					name: item.name,
					openNow: item.opening_hours,
					rating: item.rating,
					types: item.types
				});
			});
			let sendDoc = {
				data: placesDataToSend
			}
			return callBackGetData(null, sendDoc);
		}
	})
}

module.exports = Router;