/**
 * Testes unitários para Utilitários de Validação
 * 
 * Testa funções de validação e transformação de dados
 * sem dependências externas
 */
describe('Utilitários de Validação', () => {
  
  describe('Validação de Email', () => {
    const isValidEmail = (email) => {
      if (!email || typeof email !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) && !email.includes('..');
    };

    it('deve aceitar emails válidos', () => {
      const validEmails = [
        'teste@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'test123@test-domain.com'
      ];
      
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'email-invalido',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
        'user@domain..com',
        '',
        null,
        undefined
      ];
      
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('Validação de Campos Obrigatórios', () => {
    const validateRequiredFields = (data, fields) => {
      const errors = [];
      fields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
          errors.push(`${field} é obrigatório`);
        }
      });
      return errors;
    };

    it('deve validar campos obrigatórios presentes', () => {
      const data = { nome: 'João', email: 'joao@example.com', idade: 25 };
      const requiredFields = ['nome', 'email'];
      
      const errors = validateRequiredFields(data, requiredFields);
      
      expect(errors).toHaveLength(0);
    });

    it('deve detectar campos obrigatórios ausentes', () => {
      const data = { nome: 'João', email: '' };
      const requiredFields = ['nome', 'email', 'idade'];
      
      const errors = validateRequiredFields(data, requiredFields);
      
      expect(errors).toContain('email é obrigatório');
      expect(errors).toContain('idade é obrigatório');
      expect(errors).not.toContain('nome é obrigatório');
    });

    it('deve detectar campos vazios', () => {
      const data = { nome: '   ', email: 'joao@example.com' };
      const requiredFields = ['nome', 'email'];
      
      const errors = validateRequiredFields(data, requiredFields);
      
      expect(errors).toContain('nome é obrigatório');
      expect(errors).not.toContain('email é obrigatório');
    });
  });

  describe('Validação de Tamanho de Campos', () => {
    const validateFieldLength = (value, min, max) => {
      if (!value) return 'Campo é obrigatório';
      if (value.length < min) return `Muito curto (mínimo ${min} caracteres)`;
      if (value.length > max) return `Muito longo (máximo ${max} caracteres)`;
      return null;
    };

    it('deve aceitar campos com tamanho válido', () => {
      expect(validateFieldLength('João', 2, 50)).toBeNull();
      expect(validateFieldLength('A'.repeat(10), 5, 20)).toBeNull();
    });

    it('deve rejeitar campos muito curtos', () => {
      expect(validateFieldLength('A', 2, 50)).toContain('Muito curto');
      expect(validateFieldLength('', 1, 50)).toContain('Campo é obrigatório');
    });

    it('deve rejeitar campos muito longos', () => {
      expect(validateFieldLength('A'.repeat(51), 2, 50)).toContain('Muito longo');
    });
  });

  describe('Validação de ID', () => {
    const isValidId = (id) => {
      if (!id) return false;
      if (typeof id === 'string') {
        return id.length >= 10 && /^[a-zA-Z0-9]+$/.test(id);
      }
      if (typeof id === 'number') {
        return id > 0 && Number.isInteger(id);
      }
      return false;
    };

    it('deve aceitar IDs válidos', () => {
      expect(isValidId(1)).toBe(true);
      expect(isValidId(123)).toBe(true);
      expect(isValidId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidId('abc123def456')).toBe(true);
    });

    it('deve rejeitar IDs inválidos', () => {
      expect(isValidId(0)).toBe(false);
      expect(isValidId(-1)).toBe(false);
      expect(isValidId('')).toBe(false);
      expect(isValidId('123')).toBe(false); // muito curto
      expect(isValidId('abc-123')).toBe(false); // caracteres inválidos
      expect(isValidId(null)).toBe(false);
      expect(isValidId(undefined)).toBe(false);
    });
  });

  describe('Sanitização de Dados', () => {
    const sanitizeUser = (user) => {
      const { password, ...sanitized } = user;
      return sanitized;
    };

    it('deve remover campos sensíveis', () => {
      const userData = {
        id: 1,
        nome: 'João',
        email: 'joao@example.com',
        password: 'senha123',
        token: 'jwt-token',
        createdAt: new Date()
      };
      
      const result = sanitizeUser(userData);
      
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('nome', 'João');
      expect(result).toHaveProperty('email', 'joao@example.com');
    });

    it('deve manter todos os campos exceto password', () => {
      const userData = {
        id: 1,
        nome: 'João',
        email: 'joao@example.com',
        password: 'senha123'
      };
      
      const result = sanitizeUser(userData);
      
      expect(Object.keys(result)).toEqual(['id', 'nome', 'email']);
    });
  });

  describe('Formatação de Resposta', () => {
    const formatPaginatedResponse = (data, page, limit, total) => {
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    };

    it('deve formatar resposta paginada corretamente', () => {
      const data = [
        { id: 1, nome: 'Item 1' },
        { id: 2, nome: 'Item 2' }
      ];
      
      const result = formatPaginatedResponse(data, 1, 10, 25);
      
      expect(result).toEqual({
        data,
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3
      });
    });

    it('deve calcular total de páginas corretamente', () => {
      expect(formatPaginatedResponse([], 1, 10, 0).totalPages).toBe(0);
      expect(formatPaginatedResponse([], 1, 10, 10).totalPages).toBe(1);
      expect(formatPaginatedResponse([], 1, 10, 11).totalPages).toBe(2);
      expect(formatPaginatedResponse([], 1, 10, 25).totalPages).toBe(3);
    });
  });

  describe('Validação de Paginação', () => {
    const validatePagination = (page, limit) => {
      const errors = [];
      
      if (!page || page < 1) {
        errors.push('Página deve ser maior que 0');
      }
      
      if (!limit || limit < 1) {
        errors.push('Limite deve ser maior que 0');
      }
      
      if (limit > 100) {
        errors.push('Limite máximo é 100');
      }
      
      return errors;
    };

    it('deve aceitar parâmetros de paginação válidos', () => {
      expect(validatePagination(1, 10)).toHaveLength(0);
      expect(validatePagination(5, 50)).toHaveLength(0);
    });

    it('deve rejeitar página inválida', () => {
      expect(validatePagination(0, 10)).toContain('Página deve ser maior que 0');
      expect(validatePagination(-1, 10)).toContain('Página deve ser maior que 0');
    });

    it('deve rejeitar limite inválido', () => {
      expect(validatePagination(1, 0)).toContain('Limite deve ser maior que 0');
      expect(validatePagination(1, -1)).toContain('Limite deve ser maior que 0');
      expect(validatePagination(1, 101)).toContain('Limite máximo é 100');
    });
  });
});
