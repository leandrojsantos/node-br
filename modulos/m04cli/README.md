# CLI node

As aplicações que se utilizam da linha de comando do Sistema Operacional são comumente chamadas de CLI Applications ou Command-Line Interface Applications.  O que isto quer dizer? Estas aplicações só sofrerão alguma interação caso ela seja feita através de um Shell (BASH, DOS, ZSH, entre outros), mediante entrada de texto.

Este tipo de aplicação é contrária as GUI Applications ou Graphical User Interface Applications, que permitem o usuário interagir com a aplicação através de ícones, disposição dos elementos na tela, utilizando-se do Mouse para isto.

Por que utilizar CLI?
Um dos principais motivos é a agilidade com que algumas tarefas podem ser executadas. Por utilizar apenas texto, algumas tarefas triviais são mais simples de serem executadas. Por exemplo, para copiar todos os arquivos com terminação .js de um diretório para outro:

GUI:

* Abrir o gerenciador de arquivos
* Navegar entre os diretórios até achar o desejado
* Selecionar todos os arquivos que terminam com .js
* Copiar os arquivos
* Trocar de diretório no gerenciador de arquivos
* Colar os arquivos

CLI:

* Abrir o terminal
* Executar o comando de cópia cp .js destinationfolder

No index.js fiz mas alguns comentários

#### 🎲 Rodando o Projeto

```bash
# Clone este repositório
$ git clone git@github.com:leandrojsantos/node-br.git

# Acesse a pasta do projeto no terminal/cmd, vá para a pasta raiz do projeto
$ cd node-br/m04cli

# Instale as dependências
$ npm install

# para iniciar o projeto
$ node index.js --help

```
