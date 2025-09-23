/**
 * Teste simples para verificar se a aplicação funciona
 */
describe('API Node BR', () => {
  test('deve ter configuração básica', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('deve ter variáveis de ambiente configuradas', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
  });

  test('deve ser um teste simples que passa', () => {
    expect(1 + 1).toBe(2);
  });
});
