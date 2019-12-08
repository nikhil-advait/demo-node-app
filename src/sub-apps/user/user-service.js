const db = require('../../common/db');

const users = db.users;

let id = 0;

const createUser = async (user) => {
    id = id + 1;
    user.id = id;
    // Note: Signing up with already taken username is not handled. User will be overridden.
    users[user.username] = user;
    // Using spreading to exclude password from returning object. Could use shallow clone techniques like Object.assign() and
    // then delete password key on cloned object.
    const {password, ...userWithoutPassoword} = user;
    return userWithoutPassoword;
};

// Example of jsdoc comment. Should be provided for all functions if not using typescript.
// Here not creating jsdoc comments for other functions but only for this one to demostrate.

/**
 * Queries all the teachers with the specified ids.  Throws an error if it didn't find all the teachers.
 *
 * @param {object} userQueryObj The object containing query params for querying user.
 * @returns {Promise<object>} The user in the data store
 */
const findUser = async (userQueryObj) => {
    return users[userQueryObj.username];
};

// Mark functions async to simulate db even though it's not needed in this case of memory store.
module.exports = {
    createUser,
    findUser
};