const express = require('express');
const stockRouter = express.Router();
const joi = require('joi');
const controller = require('./stock-controller');
const helpers = require('../../common/helpers');

// Use joi validation to sanitize data at the entry point itself.
// Can use other libraries which are similar to joi but are more performant.
const stockSchema = joi.object({
    tickerSymbol: joi.string().required(),
    price: joi.number().positive().required(),
});


// /stocks route. Doesn't need authentication.
stockRouter.post('/', helpers.validateReqBody(stockSchema), controller.storeStock);

// /stocks/:tickerSymbol/get-average route.
// Is authenticated with helpers.authenticateReq middleware. Using simple auth mechanism to demonstrate use of auth middleware
// We can use many strategies with passport and/or JWT.
stockRouter.get('/:tickerSymbol/average', helpers.authenticateReq, controller.getAverage);


module.exports = stockRouter;