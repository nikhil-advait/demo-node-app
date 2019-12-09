const express = require('express');
const userRouter = express.Router();
const joi = require('joi');
const controller = require('./user-controller');
const helpers = require('../../common/helpers');

// Use joi validation to sanitize data at the entry point itself.
// Can use other libraries which are similar to joi but are more performant.
const baseUserSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(), // Could place more constraints like .pattern(/^[a-zA-Z0-9]{3,30}$/),
});

const signupUserSchema = baseUserSchema.append({
    name: joi.string() // is optional
});


/**
 * @api {post} /users/signup Creates the user
 * @apiVersion 1.0.0
 * @apiName SignupUser
 * @apiGroup users
 * @apiDescription Create the user.
 *
 * @apiParam (Body Params) {string} username The unique username for the user.
 * @apiParam (Body Params) {string} password The password for the user.
 * @apiParam (Body Params) {string} [name] The optional name of the user.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 CREATED
    "User created"

 * @apiError (Error 400) BadRequest Missing required request data or invalid data provided.
 * @apiError (Error 500) InternalServerError The service was not initialized properly or an unexpected error occurred.
 */
userRouter.post('/signup', helpers.validateReqBody(signupUserSchema), controller.signup);


/**
 * @api {post} /users/signin Signins the user.
 * @apiVersion 1.0.0
 * @apiName SigninUser
 * @apiGroup users
 * @apiDescription Signins the user and returns sessionToken.
 *
 * @apiParam (Body Params) {string} username The unique username for the user.
 * @apiParam (Body Params) {string} password The password for the user.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 SUCCESS
    {
        "sessionToken": "dsf432l23432lsfsd34"
    }

 * @apiError (Error 400) BadRequest Missing required request data or invalid data provided.
 * @apiError (Error 401) Unauthorized The call was made by an unauthorized user.
 * @apiError (Error 404) NotFound The username provides was not found.
 * @apiError (Error 500) InternalServerError The service was not initialized properly or an unexpected error occurred.
 */
userRouter.post('/signin', helpers.validateReqBody(baseUserSchema), controller.signin);


module.exports = userRouter;