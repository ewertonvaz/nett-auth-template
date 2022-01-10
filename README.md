# NTT Auth Template

Este projeto é um template com o objetivo de ser utilizado como ponto de partida para desenvolviemnto de uma API de autenticação para aplicações web. 

Ele é composto de um servidor implementado em NodeJS e Type ORM. 

Faz parte do projeto um exemplo de front-end desenvolvido em Vue.js, mas que pode ser facilmente substiutuído pelo frameworjk de sua preferência. Escrevi em Vue.js porque é o framework que gosto mais e conheço melhor.

A sigla NTT vem das inicias de Node.Js, Typescript e TypeORM, e o projeto foi criado para fins de aprendizado destas tecnologias.

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

O último passo acima faz com que o servidor node fique ativo na porta 3000. Para fazer o login utilize as credenciais abaixo:

* Email: admin@mysite.com
* Password: secret

Após fazer o login é recomendável que você registre um usuário que será o Administrador....



## Configuração customizada

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