/**
 * Testes unitários para Funções Auxiliares
 *
 * Testa funções utilitárias e auxiliares
 * sem dependências externas
 */
describe('Funções Auxiliares', () => {

  describe('StringHelper', () => {
    const StringHelper = {
      capitalize: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      },

      slugify: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      },

      truncate: (str, length, suffix = '...') => {
        if (!str || typeof str !== 'string') return '';
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
      },

      maskEmail: (email) => {
        if (!email || typeof email !== 'string') return '';
        const [local, domain] = email.split('@');
        if (!local || !domain) return email;

        const maskedLocal = local.length > 2
          ? local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1)
          : local;

        return `${maskedLocal}@${domain}`;
      }
    };

    describe('capitalize', () => {
      it('deve capitalizar primeira letra', () => {
        expect(StringHelper.capitalize('joão')).toBe('João');
        expect(StringHelper.capitalize('MARIA')).toBe('Maria');
        expect(StringHelper.capitalize('pedro silva')).toBe('Pedro silva');
      });

      it('deve lidar com strings vazias e inválidas', () => {
        expect(StringHelper.capitalize('')).toBe('');
        expect(StringHelper.capitalize(null)).toBe('');
        expect(StringHelper.capitalize(undefined)).toBe('');
        expect(StringHelper.capitalize(123)).toBe('');
      });
    });

    describe('slugify', () => {
      it('deve criar slug válido', () => {
        expect(StringHelper.slugify('João Silva')).toBe('joao-silva');
        expect(StringHelper.slugify('API Strategy Pattern')).toBe('api-strategy-pattern');
        expect(StringHelper.slugify('Teste@#$%^&*()')).toBe('teste');
      });

      it('deve lidar com caracteres especiais', () => {
        expect(StringHelper.slugify('João-Silva_Teste')).toBe('joao-silva-teste');
        expect(StringHelper.slugify('  Espaços   Múltiplos  ')).toBe('espacos-multiplos');
      });

      it('deve lidar com strings vazias e inválidas', () => {
        expect(StringHelper.slugify('')).toBe('');
        expect(StringHelper.slugify(null)).toBe('');
        expect(StringHelper.slugify(undefined)).toBe('');
      });
    });

    describe('truncate', () => {
      it('deve truncar string longa', () => {
        expect(StringHelper.truncate('Esta é uma string muito longa', 10)).toBe('Esta é ...');
        expect(StringHelper.truncate('João Silva', 5, '***')).toBe('Jo***');
      });

      it('deve retornar string completa se menor que limite', () => {
        expect(StringHelper.truncate('João', 10)).toBe('João');
        expect(StringHelper.truncate('Teste', 5)).toBe('Teste');
      });

      it('deve lidar com strings vazias e inválidas', () => {
        expect(StringHelper.truncate('', 10)).toBe('');
        expect(StringHelper.truncate(null, 10)).toBe('');
        expect(StringHelper.truncate(undefined, 10)).toBe('');
      });
    });

    describe('maskEmail', () => {
      it('deve mascarar email corretamente', () => {
        expect(StringHelper.maskEmail('joao@example.com')).toBe('j**o@example.com');
        expect(StringHelper.maskEmail('maria.silva@test.com')).toBe('m*********a@test.com');
      });

      it('deve lidar com emails curtos', () => {
        expect(StringHelper.maskEmail('ab@test.com')).toBe('ab@test.com');
        expect(StringHelper.maskEmail('a@test.com')).toBe('a@test.com');
      });

      it('deve lidar com emails inválidos', () => {
        expect(StringHelper.maskEmail('email-invalido')).toBe('email-invalido');
        expect(StringHelper.maskEmail('')).toBe('');
        expect(StringHelper.maskEmail(null)).toBe('');
      });
    });
  });

  describe('NumberHelper', () => {
    const NumberHelper = {
      formatCurrency: (value, currency = 'BRL') => {
        if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';

        const formatter = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency
        });

        return formatter.format(value);
      },

      formatNumber: (value, decimals = 2) => {
        if (typeof value !== 'number' || isNaN(value)) return '0,00';

        return value.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
      },

      randomBetween: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      isEven: (num) => {
        return typeof num === 'number' && num % 2 === 0;
      },

      isOdd: (num) => {
        return typeof num === 'number' && num % 2 !== 0;
      }
    };

    describe('formatCurrency', () => {
      it('deve formatar moeda corretamente', () => {
        expect(NumberHelper.formatCurrency(1234.56)).toMatch(/R\$\s*1\.234,56/);
        expect(NumberHelper.formatCurrency(0)).toMatch(/R\$\s*0,00/);
        expect(NumberHelper.formatCurrency(999.99)).toMatch(/R\$\s*999,99/);
      });

      it('deve lidar com valores inválidos', () => {
        expect(NumberHelper.formatCurrency('abc')).toBe('R$ 0,00');
        expect(NumberHelper.formatCurrency(null)).toBe('R$ 0,00');
        expect(NumberHelper.formatCurrency(undefined)).toBe('R$ 0,00');
      });
    });

    describe('formatNumber', () => {
      it('deve formatar número corretamente', () => {
        expect(NumberHelper.formatNumber(1234.567)).toBe('1.234,57');
        expect(NumberHelper.formatNumber(0)).toBe('0,00');
        expect(NumberHelper.formatNumber(999.1, 1)).toBe('999,1');
      });

      it('deve lidar com valores inválidos', () => {
        expect(NumberHelper.formatNumber('abc')).toBe('0,00');
        expect(NumberHelper.formatNumber(null)).toBe('0,00');
      });
    });

    describe('randomBetween', () => {
      it('deve gerar número dentro do intervalo', () => {
        for (let i = 0; i < 100; i++) {
          const num = NumberHelper.randomBetween(1, 10);
          expect(num).toBeGreaterThanOrEqual(1);
          expect(num).toBeLessThanOrEqual(10);
        }
      });

      it('deve gerar números diferentes', () => {
        const numbers = new Set();
        for (let i = 0; i < 50; i++) {
          numbers.add(NumberHelper.randomBetween(1, 100));
        }
        expect(numbers.size).toBeGreaterThan(1);
      });
    });

    describe('isEven e isOdd', () => {
      it('deve identificar números pares', () => {
        expect(NumberHelper.isEven(2)).toBe(true);
        expect(NumberHelper.isEven(4)).toBe(true);
        expect(NumberHelper.isEven(0)).toBe(true);
        expect(NumberHelper.isEven(1)).toBe(false);
        expect(NumberHelper.isEven(3)).toBe(false);
      });

      it('deve identificar números ímpares', () => {
        expect(NumberHelper.isOdd(1)).toBe(true);
        expect(NumberHelper.isOdd(3)).toBe(true);
        expect(NumberHelper.isOdd(2)).toBe(false);
        expect(NumberHelper.isOdd(4)).toBe(false);
        expect(NumberHelper.isOdd(0)).toBe(false);
      });

      it('deve lidar com valores inválidos', () => {
        expect(NumberHelper.isEven('abc')).toBe(false);
        expect(NumberHelper.isOdd(null)).toBe(false);
        expect(NumberHelper.isEven(undefined)).toBe(false);
      });
    });
  });

  describe('DateHelper', () => {
    const DateHelper = {
      formatDate: (date, format = 'DD/MM/YYYY') => {
        if (!date || !(date instanceof Date)) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return format
          .replace('DD', day)
          .replace('MM', month)
          .replace('YYYY', year)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds);
      },

      isToday: (date) => {
        if (!date || !(date instanceof Date)) return false;

        const today = new Date();
        return date.toDateString() === today.toDateString();
      },

      isWeekend: (date) => {
        if (!date || !(date instanceof Date)) return false;

        const day = date.getDay();
        return day === 0 || day === 6; // Domingo (0) ou Sábado (6)
      },

      addDays: (date, days) => {
        if (!date || !(date instanceof Date)) return null;

        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      },

      getAge: (birthDate) => {
        if (!birthDate || !(birthDate instanceof Date)) return 0;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age;
      }
    };

    describe('formatDate', () => {
      it('deve formatar data corretamente', () => {
        const date = new Date('2023-12-25T15:30:45');
        expect(DateHelper.formatDate(date)).toBe('25/12/2023');
        expect(DateHelper.formatDate(date, 'DD/MM/YYYY HH:mm')).toBe('25/12/2023 15:30');
        expect(DateHelper.formatDate(date, 'YYYY-MM-DD')).toBe('2023-12-25');
      });

      it('deve lidar com datas inválidas', () => {
        expect(DateHelper.formatDate(null)).toBe('');
        expect(DateHelper.formatDate(undefined)).toBe('');
        expect(DateHelper.formatDate('invalid')).toBe('');
      });
    });

    describe('isToday', () => {
      it('deve identificar se é hoje', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        expect(DateHelper.isToday(today)).toBe(true);
        expect(DateHelper.isToday(yesterday)).toBe(false);
      });

      it('deve lidar com datas inválidas', () => {
        expect(DateHelper.isToday(null)).toBe(false);
        expect(DateHelper.isToday(undefined)).toBe(false);
      });
    });

    describe('isWeekend', () => {
      it('deve identificar fins de semana', () => {
        const saturday = new Date(2023, 11, 23); // 23 de dezembro de 2023 (sábado)
        const sunday = new Date(2023, 11, 24); // 24 de dezembro de 2023 (domingo)
        const monday = new Date(2023, 11, 25); // 25 de dezembro de 2023 (segunda)

        expect(DateHelper.isWeekend(saturday)).toBe(true);
        expect(DateHelper.isWeekend(sunday)).toBe(true);
        expect(DateHelper.isWeekend(monday)).toBe(false);
      });
    });

    describe('addDays', () => {
      it('deve adicionar dias corretamente', () => {
        const date = new Date(2023, 11, 25); // 25 de dezembro de 2023
        const result = DateHelper.addDays(date, 5);

        expect(result.getDate()).toBe(30);
        expect(result.getMonth()).toBe(11); // Dezembro (0-indexed)
        expect(result.getFullYear()).toBe(2023);
      });

      it('deve lidar com datas inválidas', () => {
        expect(DateHelper.addDays(null, 5)).toBeNull();
        expect(DateHelper.addDays(undefined, 5)).toBeNull();
      });
    });

    describe('getAge', () => {
      it('deve calcular idade corretamente', () => {
        const birthDate = new Date('1990-01-01');
        const age = DateHelper.getAge(birthDate);

        expect(age).toBeGreaterThan(30);
        expect(age).toBeLessThan(50);
      });

      it('deve lidar com datas inválidas', () => {
        expect(DateHelper.getAge(null)).toBe(0);
        expect(DateHelper.getAge(undefined)).toBe(0);
      });
    });
  });

  describe('ArrayHelper', () => {
    const ArrayHelper = {
      unique: (array) => {
        if (!Array.isArray(array)) return [];
        return [...new Set(array)];
      },

      groupBy: (array, key) => {
        if (!Array.isArray(array)) return {};

        return array.reduce((groups, item) => {
          const group = item[key];
          if (!groups[group]) {
            groups[group] = [];
          }
          groups[group].push(item);
          return groups;
        }, {});
      },

      sortBy: (array, key, order = 'asc') => {
        if (!Array.isArray(array)) return [];

        return [...array].sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];

          if (order === 'desc') {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      },

      chunk: (array, size) => {
        if (!Array.isArray(array) || size <= 0) return [];

        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks;
      }
    };

    describe('unique', () => {
      it('deve remover duplicatas', () => {
        expect(ArrayHelper.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        expect(ArrayHelper.unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      });

      it('deve lidar com arrays inválidos', () => {
        expect(ArrayHelper.unique(null)).toEqual([]);
        expect(ArrayHelper.unique(undefined)).toEqual([]);
        expect(ArrayHelper.unique('string')).toEqual([]);
      });
    });

    describe('groupBy', () => {
      it('deve agrupar por chave', () => {
        const data = [
          { category: 'A', value: 1 },
          { category: 'B', value: 2 },
          { category: 'A', value: 3 }
        ];

        const result = ArrayHelper.groupBy(data, 'category');

        expect(result).toEqual({
          A: [{ category: 'A', value: 1 }, { category: 'A', value: 3 }],
          B: [{ category: 'B', value: 2 }]
        });
      });
    });

    describe('sortBy', () => {
      it('deve ordenar por chave', () => {
        const data = [
          { name: 'João', age: 30 },
          { name: 'Maria', age: 25 },
          { name: 'Pedro', age: 35 }
        ];

        const result = ArrayHelper.sortBy(data, 'age');

        expect(result[0].name).toBe('Maria');
        expect(result[1].name).toBe('João');
        expect(result[2].name).toBe('Pedro');
      });

      it('deve ordenar em ordem decrescente', () => {
        const data = [
          { name: 'João', age: 30 },
          { name: 'Maria', age: 25 },
          { name: 'Pedro', age: 35 }
        ];

        const result = ArrayHelper.sortBy(data, 'age', 'desc');

        expect(result[0].name).toBe('Pedro');
        expect(result[1].name).toBe('João');
        expect(result[2].name).toBe('Maria');
      });
    });

    describe('chunk', () => {
      it('deve dividir array em chunks', () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const result = ArrayHelper.chunk(array, 3);

        expect(result).toEqual([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ]);
      });

      it('deve lidar com tamanhos inválidos', () => {
        expect(ArrayHelper.chunk([1, 2, 3], 0)).toEqual([]);
        expect(ArrayHelper.chunk([1, 2, 3], -1)).toEqual([]);
      });
    });
  });
});
