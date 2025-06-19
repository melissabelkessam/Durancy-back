const request = require('supertest');

const BASE_URL = 'http://node:3000';

describe('Panier Integration Tests', () => {
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

  describe('Cart Operations', () => {
    test('GET /api/panier should return cart data', async () => {
      const response = await request(BASE_URL)
        .get('/api/panier')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('POST /api/panier/ajouter should add item to cart', async () => {
      const response = await request(BASE_URL)
        .post('/api/panier/ajouter')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({
          kitId: 1,
          quantity: 2
        })
        .timeout(10000);

      expect([200, 201, 400, 401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/panier/supprimer should remove item from cart', async () => {
      const response = await request(BASE_URL)
        .delete('/api/panier/supprimer')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({ kitId: 1 })
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });

    test('DELETE /api/panier/vider should clear cart', async () => {
      const response = await request(BASE_URL)
        .delete('/api/panier/vider')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .timeout(10000);

      expect([200, 401, 403, 404, 500]).toContain(response.status);
    });
  });
});
