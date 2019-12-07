// We can use ES modules with node.js 13.x and above (or using typescript), but will use commonjs to keep things simple.
const express = require('express');
const bodyParser = require('body-parser');

// import /users/index.js
const usersRouter = require('./sub-apps/users/routes');

const app = express();

// use body parser middleware to parse request bodies for all requests.
app.use(bodyParser.json());

// mount users sub-app on main app on '/users' route.
app.use('/users', usersRouter);



// Add global error handler
app.use((err, req, res, next) => {

    // res.processedError will be set from express routes (sub apps) if it is handled there.
    if (!res.processedError) {
        console.error(`ERROR!!!...caught in global error handler in route ${req.path}:`, err)
    }

    // pass error flow to default express error handler.
    next(err)
})

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

// In real app port would be passed through configuration.
app.listen(3001, () =>{
    console.log('App started on port 3001');
});