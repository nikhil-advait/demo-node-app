const handlers = require('./users-handlers');


exports.signup = async (req, res) => {
    const userObj = req.body;

    try {
        await handlers.signupHandler(userObj);
    } catch (error) {
        console.log(`Unexpected error during signup for user: ${JSON.stringify(userObj)}`, error);
        res.status(500).send('Unexpected server error');
        return;
    }

    // 201 HTTP Status code is more appropriate than 200 here.
    res.status(201).send('User created');
};


exports.signin = async (req, res) => {
    const userObj = req.body;


    // Instead of using exceptions we can also use Option(aka MayBe) or Result(aka Either) monads. Although they play well with
    // typescript but still are better than exceptions in js.
    // Using exception here though.

    let sessionToken;
    try {
        sessionToken = await handlers.signinHandler(userObj);
    } catch (error) {
        let errMsg;
        let statusCode;

        if (error.errCode === 401) {
            errMsg = error.message;
            // UnAuthorised error
            statusCode = 401;
        } else if (error.errCode === 404) {
            errMsg = error.message;
            // Not found statusCode
            statusCode = 404;
        } else {
            errMsg = `Unexpected error occured.`;
            statusCode = 500;
        }

        console.log(`Error during signin for user: ${JSON.stringify(userObj)}. Err: ${errMsg}`, error);
        res.status(statusCode).send({ errMsg });
        return;
    }

    // Send the sessionToken back to caller who should send it along with custom header(x-auth) with every new request.
    // We could have also used cookies for simplification but not every client is browser.
    res.status(200).send({ sessionToken });
};

