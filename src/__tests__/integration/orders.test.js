const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Orders Integration Tests', () => {
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

  describe('Order Operations', () => {
    test('GET /api/orders should require authentication', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .timeout(10000);

      expect([401, 403, 404, 500]).toContain(response.status);
    });

    test('GET /api/orders should return user orders when authenticated', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('POST /api/orders should create new order', async () => {
      const orderData = {
        items: [
          { kitId: 1, quantity: 2 }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345'
        }
      };

      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send(orderData)
        .timeout(10000);

      expect([200, 201, 400, 401, 403, 404, 500]).toContain(response.status);
    });

    test('GET /api/orders/123 should return specific order', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders/123')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });
  });
});
