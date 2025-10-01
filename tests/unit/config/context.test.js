const { DatabaseContext } = require('../../../src/config/context.js');

/**
 * Testes unitários para DatabaseContext
 *
 * Testa o contexto do Strategy Pattern que permite alternar entre
 * diferentes implementações de banco de dados (MongoDB, PostgreSQL)
 */
describe('DatabaseContext', () => {
  let context;
  let mockStrategy;

  beforeEach(() => {
    mockStrategy = {
      isConnected: jest.fn(),
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn()
    };
    context = new DatabaseContext(mockStrategy);
  });

  describe('constructor', () => {
    it('deve inicializar com uma estratégia', () => {
      expect(context.strategy).toBe(mockStrategy);
    });
  });

  describe('isConnected', () => {
    it('deve chamar isConnected da estratégia', async () => {
      mockStrategy.isConnected.mockResolvedValue(true);

      const result = await context.isConnected();

      expect(mockStrategy.isConnected).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('create', () => {
    it('deve chamar create da estratégia com os dados', async () => {
      const data = { name: 'Test' };
      mockStrategy.create.mockResolvedValue({ id: 1, ...data });

      const result = await context.create(data);

      expect(mockStrategy.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 1, ...data });
    });
  });

  describe('read', () => {
    it('deve chamar read da estratégia com filtros', async () => {
      const filters = { page: 1, limit: 10 };
      const expectedResult = [{ id: 1, name: 'Test' }];
      mockStrategy.read.mockResolvedValue(expectedResult);

      const result = await context.read(filters);

      expect(mockStrategy.read).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('deve chamar update da estratégia com id e dados', async () => {
      const id = 1;
      const data = { name: 'Updated' };
      const expectedResult = { id, ...data };
      mockStrategy.update.mockResolvedValue(expectedResult);

      const result = await context.update(id, data);

      expect(mockStrategy.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('deve chamar delete da estratégia com id', async () => {
      const id = 1;
      mockStrategy.delete.mockResolvedValue(true);

      const result = await context.delete(id);

      expect(mockStrategy.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });

  describe('findById', () => {
    it('deve chamar findById da estratégia', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Test' };
      mockStrategy.findById.mockResolvedValue(expectedResult);

      const result = await context.findById(id);

      expect(mockStrategy.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByEmail', () => {
    it('deve chamar findByEmail da estratégia', async () => {
      const email = 'test@example.com';
      const expectedResult = { id: 1, email };
      mockStrategy.findByEmail.mockResolvedValue(expectedResult);

      const result = await context.findByEmail(email);

      expect(mockStrategy.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedResult);
    });
  });
});
