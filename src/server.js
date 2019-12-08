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



// In real app port would be passed through configuration.
app.listen(3001, () => {
    console.log('App started on port 3001');
});


// Safety net to handle unhandled promises here. May be do process.exit() after logging.
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});
