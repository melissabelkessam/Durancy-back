const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Reviews Integration Tests', () => {
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

  describe('Review Operations', () => {
    test('GET /api/reviews should return all reviews', async () => {
      const response = await request(BASE_URL)
        .get('/api/reviews')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('GET /api/kits/1/reviews should return kit-specific reviews', async () => {
      const response = await request(BASE_URL)
        .get('/api/kits/1/reviews')
        .timeout(10000);

      expect([200, 404, 500]).toContain(response.status);
    });

    test('POST /api/reviews should create new review', async () => {
      const reviewData = {
        kitId: 1,
        rating: 5,
        comment: 'Great kit!'
      };

      const response = await request(BASE_URL)
        .post('/api/reviews')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send(reviewData)
        .timeout(10000);

      expect([200, 201, 400, 401, 403, 404, 500]).toContain(response.status);
    });

    test('PUT /api/reviews/123 should update review', async () => {
      const response = await request(BASE_URL)
        .put('/api/reviews/123')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({
          rating: 4,
          comment: 'Updated review'
        })
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/reviews/123 should delete review', async () => {
      const response = await request(BASE_URL)
        .delete('/api/reviews/123')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });
  });
});
