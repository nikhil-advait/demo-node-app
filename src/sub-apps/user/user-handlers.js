const bcrypt = require('bcrypt');

// Using uuid v4 for simplicity here. Could use v5 in real app
const uuid = require('uuid/v4');

const CustomError = require('../../common/helpers').CustomError;
const userSV = require('./user-service');

// User sub app should only access service from other sub-apps and nothing else.
const sessionsSV = require('../session/session-service');


// In some apps it may be need to to signin user automatically once user signup. Here we just do signup.
exports.signupHandler = async (user) => {
    // We could also give salt to hash function for advance protection. Salt for local development could be picked from config.json.
    // But this config.json should be overriden by new one during deployment to different envs.
    // Else sensetive information (like salt) should be passed through env variables to applicaton.

    // Giving rounds to hash function to keep things simple.
    user.password = await bcrypt.hash(user.password, 10);
    await userSV.createUser(user);
}


exports.signinHandler = async (user) => {
    const userInDb = await userSV.findUser({ username: user.username });

    // Instead of using exceptions we can also use Option(aka MayBe) or Result(aka Either) like Scala/Rust. Although they play well with
    // typescript but still are better than exceptions in js.
    // Using exception here though.

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
    await sessionsSV.createSession(sessionToken, userInDb);

    return sessionToken;
}
