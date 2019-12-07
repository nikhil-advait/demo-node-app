const bcrypt = require('bcrypt');

// Using uuid v4 for simplicity here. Could use v5 in real app
const uuid = require('uuid/v4');

const CustomError = require('../../utils/helpers').CustomError;
const usersDb = require('../../db-helpers/users-db');
const sessionsStore = require('../../db-helpers/sessions-store');


// In some apps it may be need to to signin user automatically once user signup. Here we just do signup.
exports.signupHandler = async (user) => {
    // We could also give salt to hash function. Salt for local development could be picked from config.json.
    // But this config.json should be overriden by new one during deployment to different envs.
    // Or else sensetive infomration (like salt) should be passed through env variables to applicaton.

    // Giving rounds to hash function to keep things simple. Can use more advanced hashing (with salt and all) in real app.
    user.password = await bcrypt.hash(user.password, 10);
    await usersDb.createUser(user);
}


exports.signinHandler = async (user) => {
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
