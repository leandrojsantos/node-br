const assert = require('assert');
const PasswordHelper = require('../src/helpers/passwordHelper');

const SENHA = 'test@auth';
const HASH = '$2b$04$.7R114LrsJAek0UKyz0zjuMu9HMRqn9WSQe0FCX6L81KJyvFVT7ey'

describe('****Password Helper Suite de Testes****', function () {

    it('T1 gerar Hash', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        console.log('result', result)
        assert.ok(result.length > 10);
    });

    it('T2 comparar Hash', async () => {
        const result = PasswordHelper.comparePassword(SENHA, HASH)
        console.log('result', result)
        assert.ok(result)
    })

});