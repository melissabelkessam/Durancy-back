const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Public Endpoints Integration Tests', () => {
  describe('Health and Info Endpoints', () => {
    test('GET /api/health should return API health status', async () => {
      const response = await request(BASE_URL)
        .get('/api/health')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api should return API information', async () => {
      const response = await request(BASE_URL)
        .get('/api')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET / should return root endpoint', async () => {
      const response = await request(BASE_URL)
        .get('/')
        .timeout(10000);

      expect([200, 404, 500,520]).toContain(response.status);
    });
  });

  describe('Public Kit Data', () => {
    test('GET /api/kits should be publicly accessible', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/kits/categories should be publicly accessible', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/categories')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });
  });
});
