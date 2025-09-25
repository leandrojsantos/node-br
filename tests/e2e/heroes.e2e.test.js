const request = require('supertest');
const { waitFor } = require('../utils/waitFor');

describe('E2E - Heroes', () => {
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5000';

  it('GET /heroes deve responder 200 e retornar lista paginada', async () => {
    await waitFor(`${baseUrl}/health`);
    const response = await request(baseUrl).get('/heroes').query({ page: 1, limit: 5 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  }, 30000);
});
