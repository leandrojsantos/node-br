// Script de inicialização do MongoDB
db = db.getSiblingDB('nodebr');

// Criar usuário da aplicação
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'nodebr'
    }
  ]
});

// Criar coleção de heróis com índices
db.createCollection('heroes');

// Criar índices para melhor performance
db.heroes.createIndex({ "nome": 1 });
db.heroes.createIndex({ "status": 1 });
db.heroes.createIndex({ "nivel": -1 });
db.heroes.createIndex({ "criadoEm": -1 });

print('MongoDB inicializado com sucesso!');
