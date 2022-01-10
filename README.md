# Template de Servidor de autenticação 
### Servidor de autenticação express e Node.js escrito em TypeScript e com TypeOrm
## Pastas e arquivos

**/dist** : O código do servidor já transpilado para Javascript e que vai ser interpretado pelo servidor Node.js.

**/src**: código fonte em typescript do servidor.

**docker-compose.yml** : arquivo contendo as definições dos serviços e containers do Docker. Estão configurados o Node e MySQL.

## Pré-requisitos

* Node.js
* Yarn (opcional)
* Editor de código (VSCode de preferência)
* Docker (opcional) 
* MySQL server caso não queira usar o Docker
* TypeScript instalado, de preferência globalmente

Caso não queira usar o **yarn** pode subsituir os comando **yarn add** por **npm install --save** e **yarn add <pacote> -D** por **npm install ---save-dev <pacote>**

## Preparar o ambiente

Antes de ativar o servidor MySQL será necessário gerar a chave secreta que será usado pelo sistema nas operações de criptografia.

Primeiro copiar / renomear o arquivo **src/config/settings.example.ts** para **src/config/settings.ts**

Em seguida executar o comando abaixo:

```
yarn generate
```

ou

```
npm run generate
```

Copiar o valor de **secret_key** e incluir nos locais correspondees dos arquivos **src/config/settings.ts**  e **_volumes/scripts/script-mysql.sql**, neste último substituir o campo <senha_do_admin> pela senha do administrador que você escolher.

## Desenvolvimento

Em seu ambiente de desenvolvimento deve ter instalado o Node, e o compilador TypeScript. Entrar na pasta do projeto executar o comando:

```
yarn install
```


Para iniciar o servidor em modo de desenvolvimento executar o comando:

```
yarn dev
```

## Produção

Usar o shell  para executar os comandos abaixo:

```
yarn install
yarn build
```

No caso de serem feitas alterações na API será necessário fazer novamente o build executando o comando

```
yarn build
```

E em seguida reiniciar o container correspondente ao node-server.

# NTT Auth Template

Este projeto é um template de autenticação para ser utilizado como ponto de partida para aplicações web. Ele é composto de um servidor implementado em nodeJS e Type ORM. 

Faz parte do projeto um exemplo de front-end desenvolvido em Vue.js, mas que pode ser facilmente substiutuído pelo frameworjk de sua preferência. Escrevi em Vue.js porque é o framework que gosto mais e conheço melhor.

A sigla VNT vem das inicias de Vue.JS, Node.Js e TypeORM

## Pré Requisitos

Para utiliziar este template você precisará ter instalados em seu ambiente de desenvolvimento:

- **Docker**
- **Node JS**
- Se você utiliza o Windows: **Git Bash** ou outro shell de sua preferência (CmDer, Powershell, etc.)

Opcionalmente pode instalar também o Yarn caso prefira este no lugar do NPM.

## Características

* Autenticação de usuários utilizando tokens JWS;
* Bancos de dados separados para autenticação (usuários) e aplicação
* Possibilidade de usar MySQL e/ou PostgreSQL ou ambos ao mesmo tempo separando os bancos de dados de autenticação e da aplicação.

## Instalação

Depois de clonar o repositório siga os passos abaixo para completar a instalação do template:

1. Usando o shell de sua preferência (para quem está usando o Windows recomendo o Git Bash) entrar na pasta do projeto e executar os comandos:

 ```
   npm install
 ```
2. Renomear o arquivo src\config\settings.example.ts para src\config\settings.ts
4. Renomear o arquivo _volumes\scripts\script-mysql.samp.sql para _volumes\scripts\script-mysql.sql
4. Renomear o arquivo _volumes/dockerfiles/init.samp.sql para _volumes/dockerfiles/init.sql 
5. Gerar uma chave de autenticação executando comando:
6.    npm run generate
7. Copiar a chave gerada acima e inserir a mesma nos arquvos de configuração: setting.ts, script-mysql.sql e init.sql
8. Iniciar o container Docker executando o comando abaixo:
```
   docker-compose up -d
```
Aguardar a inicialização dos containers, principalmente o do MySQL, e depois executar o comando:

```
docker exec -i mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" < /mnt/app/script-mysql.sql'
```

O comando acima irá criar o banco de dados e as tabelas do sistema.

**Observação:** A inicialização do container *mysql* pode demorar, assim, antes de executar o comando verifique se já aparece a mensagem, "*ready for connections*" no log deste container.

9. Iniciar o servidor em modo desenvolvimento executando o comando abaixo:
```
   npm run dev
```

## Front End

Para testar o funcionamento do servidor você poderá usar o front end que desenvolvi para ser usado em conjunto com este server.  Op rojeto do fronedn está no seguinte reposítporio do GIT Hub:

**vue-ntt-frontend**

Outra opção é utilizar o Postman acessando os end-points da api que estão descritos abaixo.

### Login

O último passo acima faz com que o servidor node fique ativo na porta 3000. Para fazer o lgin utilize as credenciais abaixo:

* Email: admin@mysite.com
* Password: secret



## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

dfhdhhfd

### Alterar o SGBD de autenticação

ssfsf

Editar o arquivo *src\routes\user.routes.ts* e alterá-lo da forma descrita abaixo:

* MySQL:

  ```
  import userRepository from '../repositories/user.mysql.repository';
  ```

  Esta é a configuração padrão, ou seja, armazenar os dados de usuário/ autenticação usando o serve MySQL.

* PostgreSQL:

  ```
  import userRepository from '../repositories/user.postgres.repository';
  ```

  

Após realziar a alteração será necessário reiniciar o servidor. Note também que somente uma das opções poderá estar ativa em um dado momento. 

Os usuários deverão ser cadastados o registra-se novamente após a troca do SGBD.