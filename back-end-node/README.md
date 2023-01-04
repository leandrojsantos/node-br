<h1 align="center">
     <a href="#" alt="">BackEnd com base para Multi-Databases</a>
</h1>

<h4 align="center">
	🚧   Concluído 🚀 🚧
</h4>

Tabela de conteúdos
<!--ts-->
   * [Sobre o projeto](#-sobre-o-projeto)
   * [Funcionalidades](#-funcionalidades)
   * [Layout](#-layout)
   * [Como executar o projeto](#-como-executar-o-projeto)
     * [Pré-requisitos](#pré-requisitos)
     * [Rodando o Projeto](#user-content--rodando-o-projeto)
   * [Tecnologias](#-tecnologias)

<!--te-->


## 💻 Sobre o projeto

Back-end feito em node.js base para incio de projetos multi database

A pasta examples foi criada como exemplos de
código e comentários sobre como e funciona cada biblioteca e padrão de projeto, também a comentários no código para explicação.

Observação por causa descontinuamento do framework [hapijs](https://hapi.dev/) e essencial para que o back-end funcione, corretamente que este projeto seja instalado na versão do [Node na versão 10.19.0](https://nodejs.org/en/)
devido a esse incômodo sugiro que tenha o [nvm](https://itnext.io/nvm-the-easiest-way-to-switch-node-js-environments-on-your-machine-in-a-flash-17babb7d5f1b) que serve para gerenciar versões

---

## ⚙️ Funcionalidades

- [x] api com mongodb e mongoclient
- [x] api com postregres e adminer
- [x] api com crud em ambos os bancos de dados
- [x] testes unitários com mocha 
- [x] modo development e production

---

## 🎨 Layout

 * Os tests com apis da aplicação com mocha, no terminal:

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/1t.png"  width="400px">

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/2t.png" width="400px">
</p>

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/3t.png"  width="400px">

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/4t.png" width="400px">
</p>

* O layout da aplicação:

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/1.png"  width="400px">

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/2.png" width="400px">
</p>

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/3.png"  width="400px">

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/4.png" width="400px">
</p>

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/5.png"  width="400px">

<p align="center">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/6.png" width="400px">
</p>

* Cadastro nos bancos de dados tanto postgres (adminer) quanto mongodb (mongoclient):

<p align="left">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/1p.png"  width="400px">


  <img alt="node-mdb" title="#node-mdb" 
  src="../images/1m.png" width="400px">
</p>

* Cadastro em forma de corpo da request payload, no terminal:
 
<p align="left">
  <img alt="node-mdb" title="#node-mdb" 
  src="../images/1c.png"  width="400px">

  <img alt="node-mdb" title="#node-mdb" 
  src="../images/2c.png" width="400px">
</p>

---
## 🚀 Como executar o projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Docker](https://docs.docker.com/engine/install/ubuntu/), [Node na versão 9.7.1](https://nodejs.org/en/), para controle de versão do node [nvm](https://itnext.io/nvm-the-easiest-way-to-switch-node-js-environments-on-your-machine-in-a-flash-17babb7d5f1b)

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/) e também um navegador/Browser de sua escolha.

#### 🎲 Rodando o Projeto

```bash
# Acesse a pasta do projeto no vscode, vá para a pasta docker do projeto

# Acesse o arquivo comando-dbs.md e faça os passos para do mongodb terminal  
# Seguida já com imagens docker do mongodb/mongoclient e postgres/adminer
# Abra seu navegador em http://localhost:3000/ e http://localhost:8080/ faça login como está no arquivo comando-dbs

# Instale as dependências
$ npm install

# Tira erros de dependências
$ npm audit fix --force

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
    3. Trabalhando com o padrão Strategy para Multi DataSources
    4. Design Patterns - Strategy
    5. Sequelize como orm para postgres
    6. Json Web Token
    7. Configuracao JWT - plugins, testes e rota de login
    8. Autenticação de usuarios e hash de senha com bcrypt
    9. Trabalhando com multi-environments (development, production)
    
---



