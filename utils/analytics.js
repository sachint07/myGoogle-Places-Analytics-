const dbWapper = require("../models/dbWrapper");


module.exports.analyticsStoreData = (analyticsData) => {
    const analyticsDocumentName = `myGooglePlaces::user::analytics::${analyticsData.username}`;
    dbWapper.redisGet(`myGooglePlaces::user::${analyticsData.username}`).then((results) => {
        dbWapper.redisGet(analyticsDocumentName).then((resultsUser) => {
            if (resultsUser.dbRes != null) {
                console.log("-----resultsUser null hai------", resultsUser);
                updateAnalytics(analyticsDocumentName, results, analyticsData, resultsUser.dbRes);
            } else {
                console.log("-----resultsUser------", resultsUser);
                updateAnalytics(analyticsDocumentName, results, analyticsData, null);
            }
        })
    }).catch((err) => {
        console.log("Error ", err);
    })
}


function updateAnalytics(analyticsDocumentName, resultsSend, analyticsDataSend, existingUser) {
    if (existingUser === null) {
        myValue1 = "Not Specified";
        myValue2 = "Not Specified";
    } else {
        myValue1 = existingUser.homeLocation,
            myValue2 = existingUser.jobLocation
    }
    console.log(`i got called yoooo man ----: \n ${resultsSend}--- : \n ${analyticsDataSend},----: \n ${existingUser}`);
    let temp = JSON.parse(resultsSend.dbRes);
    let analyticsDoc = {
        firstName: temp.firstName,
        lastName: temp.lastName,
        userName: temp.username,
        emailId: temp.emailId,
        current_location: {
            lat: analyticsDataSend.lat,
            long: analyticsDataSend.long,
            DBRes: analyticsDataSend.DBRes
        },
        home_location: myValue1,
        current_search_location: {
            lat: analyticsDataSend.lat,
            long: analyticsDataSend.long,
            place: analyticsDataSend.currentLoaction
        },
        job_location: myValue2,
        recent_search_place: analyticsDataSend.currentLoaction,
        searchedKeyword: analyticsDataSend.searchedKeyWord,
        attemptsKeyWord: analyticsDataSend.searchedKeyword,
        attemptsFromPlace: analyticsDataSend.currentLoaction,
        updatedAt: new Date()
    }
    console.log(analyticsDocumentName, analyticsDoc)
    dbWapper.redisSet(analyticsDocumentName, analyticsDoc).then((res) => {
        console.log("Added in Analytics", res);
    }).catch((e) => {
        console.log("Failed in Analytics");
    })
}