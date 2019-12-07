const bcrypt = require('bcrypt');

// Using uuid v4 for simplicity here. Could use v5 in real app
const uuid = require('uuid/v4');

const CustomError = require('../../utils/helpers').CustomError;
const usersDb = require('../../db-helpers/users-db');
const sessionsStore = require('../../db-helpers/sessions-store');

const signInHandler = async (user) => {

    const userInDb = await usersDb.findUser({username: user.username});

    if (!userInDb) {
        // We are using error codes to match to http status codes here but they could be different (i.e. app specific).
        throw new CustomError('User not found', 404);
    }

    const passMatched = await bcrypt.compare(user.password, userInDb.password);

    if (!passMatched) {
        throw new CustomError('Wrong password', 401);
    }


    // If password matches
    const sessionToken = uuid();
    await sessionsStore.createSession(sessionToken, userInDb);

    return sessionToken;
}

// This file could also have functionality for signout, forgot password etc. and then we need to come up with better name for the file.

module.exports = signInHandler;