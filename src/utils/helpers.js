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

module.exports = {
    CustomError,
    validateReqBody
};