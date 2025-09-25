const request = require('supertest');
const { waitFor } = require('../utils/waitFor');

describe('E2E - Health', () => {
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5000';

  it('GET /health deve responder 200 e status OK', async () => {
    await waitFor(`${baseUrl}/health`);
    const response = await request(baseUrl).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  }, 30000);
});


