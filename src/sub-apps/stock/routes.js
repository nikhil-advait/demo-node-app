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



/**
 * @api {post} /stocks Creates stock entry
 * @apiVersion 1.0.0
 * @apiName createStockEntry
 * @apiGroup stocks
 * @apiDescription The unauthenticated webhook to create new the stock price entry.
 *
 * @apiParam (Body Params) {string} tickerSymbol The unique ticker symbol for the stock.
 * @apiParam (Body Params) {string} price The price of the stock.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 CREATED
    "Stock entry created"

 * @apiError (Error 400) BadRequest Missing required request data or invalid data provided.
 * @apiError (Error 500) InternalServerError The service was not initialized properly or an unexpected error occurred.
 */
stockRouter.post('/', helpers.validateReqBody(stockSchema), controller.storeStock);


/**
 * @api {post} /stocks/:tickerSymbol/average Gets average of stock
 * @apiVersion 1.0.0
 * @apiName getAverage
 * @apiGroup stocks
 * @apiDescription The authenticated api to get avg of recent 10 ticker entries of given ticker.
 * @apiHeader {string} x-auth Authorization token that we get back from /signin api.
 *
 * @apiParam (Route Params) {string} tickerSymbol The unique ticker symbol for the stock.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 SUCCESS
    {
        average: 19.34
    }

 * @apiError (Error 401) Unauthorized The call was made by an unauthorized user.
 * @apiError (Error 404) NotFound No stock entry for given tickerSymbol found.
 * @apiError (Error 500) InternalServerError The service was not initialized properly or an unexpected error occurred.
 */

 // Is authenticated with helpers.authenticateReq middleware. Using simple auth mechanism to demonstrate use of auth middleware
 // We can use many strategies with passport and/or JWT.
stockRouter.get('/:tickerSymbol/average', helpers.authenticateReq, controller.getAverage);


module.exports = stockRouter;