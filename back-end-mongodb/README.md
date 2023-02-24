<h1 align="center">
     <a href="#" alt="">BackEnd com base no MongoDB</a>
</h1>

<h4 align="center">
	🚧   Concluído 🚀 🚧
</h4>

Tabela de conteúdos
<!--ts-->
   * [Sobre o projeto](#-sobre-o-projeto)
   * [Funcionalidades](#-funcionalidades)
   * [Como executar o projeto](#-como-executar-o-projeto)
     * [Pré-requisitos](#pré-requisitos)
     * [Rodando o Projeto](#user-content--rodando-o-projeto)
   * [Tecnologias](#-tecnologias)

<!--te-->


## 💻 Sobre o projeto

Back-end feito em node.js base para incio de projetos com base unica mongodb.

A pasta examples foi criada como exemplos de
código e comentários sobre como e funciona cada biblioteca e padrão de projeto, também a comentários no código para explicação.

---

## ⚙️ Funcionalidades

- [x] api com mongodb e mongoclient
- [x] api com crud no banco de dados
- [x] testes unitários com mocha 
- [x] modo development e production

---
## 🚀 Como executar o projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Docker](https://docs.docker.com/engine/install/ubuntu/), [Node na versão 12.22.9](https://nodejs.org/en/), para controle de versão do node [nvm](https://itnext.io/nvm-the-easiest-way-to-switch-node-js-environments-on-your-machine-in-a-flash-17babb7d5f1b)

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/) e também um navegador/Browser de sua escolha.

#### 🎲 Rodando o Projeto

```bash
# Acesse a pasta do projeto no vscode, vá para a pasta docker do projeto

# Acesse o arquivo comando-dbs.md e faça os passos para do mongodb terminal  
# Seguida já com imagens docker do mongodb/mongoclient e postgres/adminer
# Abra seu navegador em http://localhost:3000/ e http://localhost:8080/ faça login como está no arquivo comando-dbs

# Usando node na ver v12.22.9 instale as dependências
$ npm install

# para testes na api
$ npm test

# Executa a aplicação em modo de desenvolvimento
$ npm run dev

# Executa a aplicação em modo de produção
$ npm run prod

# O servidor iniciará na porta:5000 - acesse http://localhost:5000/documentation

```
---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

    1. Resolução de promises com Async/Await
    2. Ambiente e configuração do ciclo de testes com Mocha
    3. 
    4. Design Patterns - Strategy
    5. 
    6. Mongoose como odm para mongodb
    7. Hapi.js 
    8. APIs com Hapi.js
    9. Swagger para teste com hapi
    10. Json Web Token
    11. Configuracao JWT - plugins, testes e rota de login
    12. Hapi-JWT ao nosso Serviço 
    13. Autenticação de usuarios e hash de senha com bcrypt
    14. Trabalhando com modeo development e production
    15. 
    16. MongoDB modo production com cloud Mongo atlas
    17. 
    18. PM2 para gerência do node 
    19. Expondo cobertura de código com Istanbul
    20. Docker para criar a base de teste (ver example docker)
    21. 
    22. MongoClient para interface mongodb (ver example docker) http://localhost:3000/
    23. Nanoid para criação de id únicos
---