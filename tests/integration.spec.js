const request = require('supertest');
const app = require('../src/app');

// No need to mock/stub db calls since it's in memory database for this demo app.

// Demonstrating integration tests only for one api as others will be similar.
describe('Signup Enpoint', () => {

  it('should be able to signup', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({
        username: 'a@b.com',
        password: 'pwd',
      });

    expect(res.status).toEqual(201);
    expect(res.text).toBe('User created');
  });

  it('should get 400 error incorrect input', async () => {
    const res = await request(app)
      .post('/users/signup')
      // Exclude password field
      .send({
        username: 'a@b.com'
      });

    expect(res.status).toEqual(400);
  });

});
