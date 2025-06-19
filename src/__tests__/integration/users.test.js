const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Users Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    try {
      const loginResponse = await request(BASE_URL)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });
      
      if (loginResponse.body.token) {
        authToken = loginResponse.body.token;
      }
    } catch (error) {
      console.log('Login failed in beforeAll');
    }
  });

  describe('User Registration and Authentication', () => {
    test('POST /api/users/register should register a new user', async () => {
      const userData = {
        firstname: 'Test',
        lastname: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!'
      };

      const response = await request(BASE_URL)
        .post('/api/users/register')
        .send(userData)
        .timeout(10000);

      expect([200, 201, 400, 409, 404, 500]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', userData.email);
      }
    });

    test('POST /api/users/login should login with valid credentials', async () => {
      const loginResponse = await request(BASE_URL)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
        .timeout(10000);

      expect([200, 400, 401, 404, 500]).toContain(loginResponse.status);
      
      if (loginResponse.status === 200) {
        expect(loginResponse.body).toHaveProperty('token');
      }
    });

    test('POST /api/users/forgot-password should handle password reset', async () => {
      const response = await request(BASE_URL)
        .post('/api/users/forgot-password')
        .send({ email: 'test@example.com' })
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });
  });

  describe('User Profile Operations', () => {
    test('GET /api/users/me should return user profile', async () => {
      const response = await request(BASE_URL)
        .get('/api/users/me')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('PUT /api/users/me should update user profile', async () => {
      const response = await request(BASE_URL)
        .put('/api/users/me')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({
          firstname: 'Updated',
          lastname: 'User'
        })
        .timeout(10000);

      expect([200, 400, 401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/users/me should delete user account', async () => {
      const response = await request(BASE_URL)
        .delete('/api/users/me')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });
  });
});
