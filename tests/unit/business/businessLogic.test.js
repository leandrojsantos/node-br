/**
 * Testes unitários para Lógica de Negócio
 * 
 * Testa regras de negócio e algoritmos
 * sem dependências externas
 */
describe('Lógica de Negócio', () => {
  
  describe('Cálculos de Paginação', () => {
    const calculatePagination = (total, page, limit) => {
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      
      return {
        total,
        page,
        limit,
        totalPages,
        offset,
        hasNext,
        hasPrev
      };
    };

    it('deve calcular paginação para primeira página', () => {
      const result = calculatePagination(25, 1, 10);
      
      expect(result).toEqual({
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
        offset: 0,
        hasNext: true,
        hasPrev: false
      });
    });

    it('deve calcular paginação para página do meio', () => {
      const result = calculatePagination(25, 2, 10);
      
      expect(result).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        offset: 10,
        hasNext: true,
        hasPrev: true
      });
    });

    it('deve calcular paginação para última página', () => {
      const result = calculatePagination(25, 3, 10);
      
      expect(result).toEqual({
        total: 25,
        page: 3,
        limit: 10,
        totalPages: 3,
        offset: 20,
        hasNext: false,
        hasPrev: true
      });
    });

    it('deve lidar com total zero', () => {
      const result = calculatePagination(0, 1, 10);
      
      expect(result).toEqual({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        offset: 0,
        hasNext: false,
        hasPrev: false
      });
    });
  });

  describe('Filtros de Busca', () => {
    const applyFilters = (data, filters) => {
      return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          
          return itemValue === value;
        });
      });
    };

    it('deve filtrar por nome', () => {
      const data = [
        { id: 1, nome: 'João Silva', email: 'joao@example.com' },
        { id: 2, nome: 'Maria Santos', email: 'maria@example.com' },
        { id: 3, nome: 'João Oliveira', email: 'joao.oliveira@example.com' }
      ];
      
      const result = applyFilters(data, { nome: 'joão' });
      
      expect(result).toHaveLength(2);
      expect(result[0].nome).toBe('João Silva');
      expect(result[1].nome).toBe('João Oliveira');
    });

    it('deve filtrar por email', () => {
      const data = [
        { id: 1, nome: 'João Silva', email: 'joao@example.com' },
        { id: 2, nome: 'Maria Santos', email: 'maria@example.com' },
        { id: 3, nome: 'Pedro Costa', email: 'pedro@test.com' }
      ];
      
      const result = applyFilters(data, { email: 'example.com' });
      
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('joao@example.com');
      expect(result[1].email).toBe('maria@example.com');
    });

    it('deve aplicar múltiplos filtros', () => {
      const data = [
        { id: 1, nome: 'João Silva', email: 'joao@example.com', ativo: true },
        { id: 2, nome: 'João Santos', email: 'joao.santos@test.com', ativo: true },
        { id: 3, nome: 'Maria Silva', email: 'maria@example.com', ativo: false }
      ];
      
      const result = applyFilters(data, { nome: 'joão', ativo: true });
      
      expect(result).toHaveLength(2);
      expect(result.every(item => item.nome.toLowerCase().includes('joão'))).toBe(true);
      expect(result.every(item => item.ativo)).toBe(true);
    });

    it('deve retornar todos os itens quando não há filtros', () => {
      const data = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ];
      
      const result = applyFilters(data, {});
      
      expect(result).toHaveLength(2);
    });
  });

  describe('Ordenação de Dados', () => {
    const sortData = (data, sortBy, sortOrder = 'asc') => {
      return [...data].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    };

    it('deve ordenar por nome em ordem crescente', () => {
      const data = [
        { id: 1, nome: 'Carlos' },
        { id: 2, nome: 'Ana' },
        { id: 3, nome: 'Bruno' }
      ];
      
      const result = sortData(data, 'nome', 'asc');
      
      expect(result[0].nome).toBe('Ana');
      expect(result[1].nome).toBe('Bruno');
      expect(result[2].nome).toBe('Carlos');
    });

    it('deve ordenar por nome em ordem decrescente', () => {
      const data = [
        { id: 1, nome: 'Carlos' },
        { id: 2, nome: 'Ana' },
        { id: 3, nome: 'Bruno' }
      ];
      
      const result = sortData(data, 'nome', 'desc');
      
      expect(result[0].nome).toBe('Carlos');
      expect(result[1].nome).toBe('Bruno');
      expect(result[2].nome).toBe('Ana');
    });

    it('deve ordenar por ID em ordem crescente', () => {
      const data = [
        { id: 3, nome: 'Carlos' },
        { id: 1, nome: 'Ana' },
        { id: 2, nome: 'Bruno' }
      ];
      
      const result = sortData(data, 'id', 'asc');
      
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe('Transformação de Dados', () => {
    const transformUserData = (user) => {
      return {
        id: user.id,
        nome: user.nome?.trim(),
        email: user.email?.toLowerCase(),
        ativo: Boolean(user.ativo),
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
      };
    };

    it('deve transformar dados do usuário', () => {
      const userData = {
        id: 1,
        nome: '  João Silva  ',
        email: 'JOAO@EXAMPLE.COM',
        ativo: 1,
        createdAt: '2023-01-01T00:00:00Z'
      };
      
      const result = transformUserData(userData);
      
      expect(result).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        ativo: true,
        createdAt: new Date('2023-01-01T00:00:00Z')
      });
    });

    it('deve lidar com dados ausentes', () => {
      const userData = {
        id: 1
      };
      
      const result = transformUserData(userData);
      
      expect(result).toEqual({
        id: 1,
        nome: undefined,
        email: undefined,
        ativo: false,
        createdAt: expect.any(Date)
      });
    });
  });

  describe('Validação de Regras de Negócio', () => {
    const validateBusinessRules = (user) => {
      const errors = [];
      
      // Regra: Nome deve ter pelo menos 2 palavras
      if (user.nome && user.nome.split(' ').length < 2) {
        errors.push('Nome deve conter pelo menos nome e sobrenome');
      }
      
      // Regra: Email deve ser de domínio válido
      if (user.email && !user.email.includes('@')) {
        errors.push('Email deve conter @');
      }
      
      // Regra: Idade deve ser entre 18 e 100
      if (user.idade && (user.idade < 18 || user.idade > 100)) {
        errors.push('Idade deve estar entre 18 e 100 anos');
      }
      
      return errors;
    };

    it('deve validar regras de negócio corretamente', () => {
      const validUser = {
        nome: 'João Silva',
        email: 'joao@example.com',
        idade: 25
      };
      
      const errors = validateBusinessRules(validUser);
      
      expect(errors).toHaveLength(0);
    });

    it('deve detectar nome com apenas uma palavra', () => {
      const user = {
        nome: 'João',
        email: 'joao@example.com',
        idade: 25
      };
      
      const errors = validateBusinessRules(user);
      
      expect(errors).toContain('Nome deve conter pelo menos nome e sobrenome');
    });

    it('deve detectar email inválido', () => {
      const user = {
        nome: 'João Silva',
        email: 'joao-example.com',
        idade: 25
      };
      
      const errors = validateBusinessRules(user);
      
      expect(errors).toContain('Email deve conter @');
    });

    it('deve detectar idade inválida', () => {
      const user = {
        nome: 'João Silva',
        email: 'joao@example.com',
        idade: 17
      };
      
      const errors = validateBusinessRules(user);
      
      expect(errors).toContain('Idade deve estar entre 18 e 100 anos');
    });
  });
});
