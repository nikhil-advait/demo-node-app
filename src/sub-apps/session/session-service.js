const db = require('../../common/db');

const sessions = db.sessions;

const createSession = async (sessionToken, userInfo) => {
    sessions[sessionToken] = userInfo;
};


const findSession = async (sessionToken) => {
    return sessions[sessionToken];
};

// Mark functions async to simulate db even though it's not needed in this case of memory store.
module.exports = {
    createSession,
    findSession
};