const request = require('supertest');
const { waitFor } = require('../utils/waitFor');

describe('E2E - Auth flow (register -> login -> POST /heroes)', () => {
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';
  const email = `user_${Date.now()}@test.com`;
  const password = '123456';

  it('deve registrar, autenticar e criar um herói protegido', async () => {
    await waitFor(`${baseUrl}/health`);

    // register
    const registerRes = await request(baseUrl)
      .post('/auth/register')
      .send({ nome: 'User Test', email, password });

    expect([200, 201, 400]).toContain(registerRes.status);

    // login
    const loginRes = await request(baseUrl)
      .post('/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('data.token');
    const token = loginRes.body.data.token;

    // create hero (protected)
    const heroRes = await request(baseUrl)
      .post('/heroes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Batman', poder: 'Detective', status: 'ativo', nivel: 10 });

    expect([201, 200]).toContain(heroRes.status);
  }, 40000);
});


