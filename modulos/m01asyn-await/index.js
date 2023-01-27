/**
 * 0_obter usuario
 * 1_obter numero de telefone de userario a patir de seu id
 * 2_obter endereço de usuario a patir de seu id
 */

const util = require("util");
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(function() {
      return resolve({
        id: 01,
        nome: "le",
        dataNascimento: new Date()
      });
    }, 1000);
  });
}

function obterTelefone(idUsuario) {
  return new Promise(function resolverPromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: "143449900",
        ddd: "14"
      });
    }, 2000);
  });
  
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: "rua abc",
      numero: "216"
    });
  }, 2000);
}

main();
async function main() {
  try {
    console.time("tempo");
    const usuario = await obterUsuario();
    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id)
    ]);
    const endereco = resultado[1];
    const telefone = resultado[0];
    console.log(`
            Nome: ${usuario.nome},
            Telefone: (${telefone.ddd}) ${telefone.telefone},
            Endereco: ${endereco.rua}, ${endereco.numero}
        `);
    console.timeEnd("tempo");
  } catch (error) {
    console.error("DEU RUIM", error);
  }
}