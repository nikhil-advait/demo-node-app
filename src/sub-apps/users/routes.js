const express = require('express');
const usersRouter = express.Router();
const joi = require('joi');
const controller = require('./users-controller');
const helpers = require('../../utils/helpers');

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
usersRouter.post('/signup', helpers.validateReqBody(signupUserSchema), controller.signup);

// /users/signin route
usersRouter.post('/signin', helpers.validateReqBody(baseUserSchema), controller.signin);


module.exports = usersRouter;