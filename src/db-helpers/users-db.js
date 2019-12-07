const db = require('./db');

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


const findUser = async (userQueryObj) => {
    return users[userQueryObj.username];
};

// Mark functions async to simulate db even though it's not needed in this case of memory store.
module.exports = {
    createUser,
    findUser
};