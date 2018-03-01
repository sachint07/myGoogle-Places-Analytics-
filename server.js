'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const args = require('yargs');
const dbConnection = require('./config/dbConfig');
const dbWrapper = require('./models/dbWrapper');

console.log(new Date(), "Starting Application");

const app = express();

dbWrapper.init(dbConnection);

// respond with "hello world" when a GET request is made to the homepage

//app.use('');

app.listen(3000,() => console.log('Example app listening on port 3000!'));