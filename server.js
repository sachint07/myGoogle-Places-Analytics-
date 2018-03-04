"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressLogger = require("express-logger");
//const args = require("yargs");
const dbConnection = require('./config/dbConfig');
const dbWrapper = require('./models/dbWrapper');
const getplaces = require("./apis/getplaces");
const users = require("./apis/users");
console.log(new Date(), "Starting Application");

const app = express();

dbWrapper.init(dbConnection)
app.set("etag", false);
app.use(cors());
app.use(expressLogger({ "path": "/tmp/myApisLogs.json" }));
app.use(bodyParser.json());
app.use('/getplaces/',getplaces);
app.use('/users',users);

app.listen(3000,() => console.log("MyApp listening on port 3000!"));