const assert = require('assert');
const PasswordHelper = require('../src/helpers/passwordHelper');

const SENHA = 'testPss@pss';
const HASH = '$2b$04$xD/qMwMqBSa7kTB1.lmdVOvNW/XcFcQBTMZ4SYo0QJ85gwXmWIhQy'

describe('*****passwordHelper.test******', function () {
    
    it('t1 - deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        console.log('result', result)
        assert.ok(result.length > 10);
    });

    it('t2 - deve comparar uma senha e seu hash', async () => {
        const result = PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })

});