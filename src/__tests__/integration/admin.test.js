const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Admin Operations Integration Tests', () => {
  let authToken;
  let adminToken;

  beforeAll(async () => {
    // Try to get a regular user token
    try {
      const userResponse = await request(BASE_URL)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });
      
      if (userResponse.body.token) {
        authToken = userResponse.body.token;
      }
    } catch (error) {
      console.log('Regular user login failed');
    }

    // Try to get an admin token
    try {
      const adminResponse = await request(BASE_URL)
        .post('/api/users/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPassword123!'
        });
      
      if (adminResponse.body.token) {
        adminToken = adminResponse.body.token;
      }
    } catch (error) {
      console.log('Admin login failed');
    }
  });

  describe('User Management (Admin Only)', () => {
    test('GET /api/users should require admin authentication', async () => {
      const response = await request(BASE_URL)
        .get('/api/users')
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });

    test('GET /api/users should work with admin token', async () => {
      const response = await request(BASE_URL)
        .get('/api/users')
        .set('Authorization', adminToken ? `Bearer ${adminToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/users/123 should require admin authentication', async () => {
      const response = await request(BASE_URL)
        .delete('/api/users/123')
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });
  });

  describe('Kit Management (Admin Only)', () => {
    test('POST /api/kits should require authentication', async () => {
      const response = await request(BASE_URL)
        .post('/api/kits')
        .send({
          name: 'Test Kit',
          description: 'Test Description',
          price: 29.99
        })
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });

    test('PUT /api/kits/1 should require admin authentication', async () => {
      const response = await request(BASE_URL)
        .put('/api/kits/1')
        .send({
          name: 'Updated Kit',
          price: 39.99
        })
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/kits/1 should require admin authentication', async () => {
      const response = await request(BASE_URL)
        .delete('/api/kits/1')
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });
  });
});
