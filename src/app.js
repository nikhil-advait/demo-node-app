// We can use ES modules with node.js 13.x and above (or using typescript), but will use commonjs to keep things simple.
const express = require('express');
const bodyParser = require('body-parser');

const userSubApp = require('./sub-apps/user/routes');
const stockSubApp = require('./sub-apps/stock/routes');

const app = express();

// use body parser middleware to parse request bodies for all requests.
app.use(bodyParser.json());

// mount users sub-app on main app on '/users' route.
app.use('/users', userSubApp);

// mount users sub-app on main app on '/users' route.
app.use('/stocks', stockSubApp);


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

module.exports = app;
