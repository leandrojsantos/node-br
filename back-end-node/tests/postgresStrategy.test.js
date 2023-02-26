const { equal, deepEqual, ok } = require('assert');
const HeroSchema = require('../src/db/strategies/postgres/schemas/heroSchema');
const PostgresStrategy = require('../src/db/strategies/postgres/postgresSQLStrategy');
const Context = require('../src/db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  username: 'test d',
  power: 'forca'
};

const MOCK_HEROI_ATUALIZAR = {
  username: 'test e',
  power: 'nada'
};

let context = {}

describe('*****postgresStrategy.test*****', function () {
  this.timeout(Infinity);
  before(async () => {
    const connection = await PostgresStrategy.connect()
    const model = await PostgresStrategy.defineModel(connection, HeroSchema)
    context = new Context(new PostgresStrategy(connection, model));

    await context.delete();
    await context.create(MOCK_HEROI_CADASTRAR);
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it('t1 - PostgresSQL connection', async () => {
    const result = await context.isConnected();
    equal(result, true);
  });

  it('t2 - cadastrar', async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.dataValues.id;
    deepEqual(result.dataValues, MOCK_HEROI_CADASTRAR);
  });

  it('t3 - listar', async () => {
    const [result] = await context.read(MOCK_HEROI_CADASTRAR);
    delete result.id;
    deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('t4 - atualizar', async () => {
    const [result] = await context.read({});
    const novoItem = {...MOCK_HEROI_CADASTRAR, 
      username: 'test e' 
    };
    const [update] = await context.update(result.id, novoItem);
    deepEqual(update, 1);
  });

  it('t5 - remover', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    deepEqual(result, 1);
  });
});