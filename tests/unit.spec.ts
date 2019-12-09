// Unit test to demonstrate spying/stubbing.

const bcrypt = require('bcrypt');
const userHandlers = require('../src/sub-apps/user/user-handlers');
const userSV = require('../src/sub-apps/user/user-service');

// Only writing unit test for single function to demonstrate how it can be done. Other tests will be similar.
describe('signupHandler()', () => {

  it('should be able to signup', async () => {

    const user = {
        username: 'a@b.com',
        password: 'pwd',
        name: 'Joe Smith'
    };

    spyOn(bcrypt, 'hash').and.callFake((password, rounds) => {
        expect(password).toBe('pwd');
        expect(rounds).toBe(10);
        return Promise.resolve('hashedPwd');
    });

    // Here, even if we did not stub createUser() then also it would work since it's in memory db. But in real app we need to stub
    // and test IO functions like this.
    spyOn(userSV, 'createUser').and.callFake((user) => {
        expect(user).toEqual({
            username: 'a@b.com',
            // Password should be one returned from mocked bcrypt.hash above
            password: 'hashedPwd',
            name: 'Joe Smith'
        });
        return Promise.resolve();
    });


    try {
        // Call the function under test
        await userHandlers.signupHandler(user);
    } catch(err) {
        fail('Handler should not throw any error');
    }

    // Verify that stubbed function got called.
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(userSV.createUser).toHaveBeenCalledTimes(1);

  });


});
