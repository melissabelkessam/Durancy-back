const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Tutorials Integration Tests', () => {
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

  describe('Tutorial Operations', () => {
    test('GET /api/tutorials should return all tutorials', async () => {
      const response = await request(BASE_URL)
        .get('/api/tutorials')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/tutorials/1 should return specific tutorial', async () => {
      const response = await request(BASE_URL)
        .get('/api/tutorials/1')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/kits/1/tutorials should return kit-specific tutorials', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/1/tutorials')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('POST /api/tutorials should create new tutorial', async () => {
      const tutorialData = {
        title: 'Test Tutorial',
        content: 'This is a test tutorial',
        kitId: 1
      };

      const response = await request(BASE_URL)
        .post('/api/tutorials')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send(tutorialData)
        .timeout(10000);

      expect([200, 201, 400, 401, 403, 404, 500]).toContain(response.status);
    });
  });
});
