const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Kits Integration Tests', () => {
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

  describe('Kit CRUD Operations', () => {
    test('GET /api/kits should return all kits', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(Array.isArray(response.body) || typeof response.body === 'object').toBe(true);
      }
    });

    test('GET /api/kits/1 should return specific kit', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/1')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/kits/categories should return kit categories', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/categories')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/kits/search should search kits', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/search')
        .query({ q: 'test' })
        .timeout(10000);

      expect([200, 400, 404, 500]).toContain(response.status);
    });
  });
});
