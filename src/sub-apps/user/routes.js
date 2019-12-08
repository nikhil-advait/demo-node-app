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


// Following routes don't need authentication.

// /users/signup route
userRouter.post('/signup', helpers.validateReqBody(signupUserSchema), controller.signup);

// /users/signin route
userRouter.post('/signin', helpers.validateReqBody(baseUserSchema), controller.signin);


module.exports = userRouter;