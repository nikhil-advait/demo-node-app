// It's fine to access services from subapps in common.
const sessionSV = require('../sub-apps/session/session-service');


// We need to extend Error so that we maintain stack traces.
// There are only handful of times where we need to use 'Classes' or 'inheritance' in javascript (Otherwise we can manage things with
// only functions and composition)
// Infact we could have used prototypal inheritance here to but this is okay.
class CustomError extends Error {
    constructor(message, errCode) {
        super(message);
        this.errCode = errCode;
    }
}


// Request body validation middleware
const validateReqBody = (joiSchema) => {
    return (req, res, next) => {
        // Validate using joi schema
        const validationResult = joiSchema.validate(req.body);

        if (validationResult.error) {
            // Should be something like logger.debug() in real app.
            console.log(`Request body validation failed for request: ${req.originalUrl}.  req.body: (${JSON.stringify(req.body)}). Error: `,
                validationResult.error);

            // May not need to send error back to client except for dev env.
            res.status(400).send(validationResult.error);
        } else {
            // Call next middleware
            next();
        }
    }
}

// Middleware to handle exceptions and foward it to global error handler.
const handleAsyncExceptions = (asyncFn) => {
    return async (req, res, next) => {
        try {
            await asyncFn(req, res, next);
            next();
        } catch (err) {

            // Catch CustomError here and send back appropriate statuscode and error message to client.
            if (err instanceof CustomError) {
                console.log(`Error for request: ${req.originalUrl}. Err: ${err.message}`, err);
                // May be don't send err.message back except for development.
                // In this demo app we are using http status code as our err codes (but they could be different in real app and
                // we could map then to proper http status codes.)
                res.status(err.errCode).send(err.message);
            }
            else {
                // Add proper checks to detect programmers errors such as: Uncaught TypeError and log/generate notification/exit service
                // depending upon stragegy we choose.
                //if (programmerError) {
                    // exit service?
                //}

                // If not a programmer error then log and send back 500 status code.
                console.error(`Unknown error happened for request: ${req.originalUrl}.`, err);
                res.status(500).send(err.message || err);
            }
        }
    }
};

// Middleware to authenticate request.
const authenticateReq = async (req, res, next) => {
    const sessionToken = req.headers['x-auth'];

    if (sessionToken) {
        const session = await sessionSV.findSession(sessionToken);
        if (session) {
            req.session = session;
            next();
        } else {
            // Send Unauthorized status code back.
            console.log(`No session found for provided session token for request: ${req.originalUrl}`);
            res.status(401).send('No session found');
        }
    } else {
        // Send Unauthorized status code back.
        console.log(`No session token provided for request: ${req.originalUrl}`);
        res.status(401).send('No session token provided');
    }

};

module.exports = {
    CustomError,
    validateReqBody,
    handleAsyncExceptions,
    authenticateReq
};