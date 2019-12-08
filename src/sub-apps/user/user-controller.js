const handlers = require('./user-handlers');
const handleAsyncExceptions = require('../../common/helpers').handleAsyncExceptions;


exports.signup = handleAsyncExceptions(async (req, res) => {

    // Any errors thwon will be handled by handleAsyncExceptions() and appropriate status code will be sent back to client.
    await handlers.signupHandler(req.body);

    // 201 HTTP Status code is more appropriate than 200 here.
    res.status(201).send('User created');
});


exports.signin = handleAsyncExceptions(async (req, res) => {

    // Any errors thwon will be handled by handleAsyncExceptions() and appropriate status code will be sent back to client.
    const sessionToken = await handlers.signinHandler(req.body);

    // Send the sessionToken back to caller who should send it along with custom header(x-auth) with every new request.
    // We could have also used cookies for simplification but not every client is browser.
    res.status(200).send({ sessionToken });
});

