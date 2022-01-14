# NETT Auth Template

Este projeto é um template de servidor que pode ser utilizado como ponto de partida para desenvolvimento de uma API de autenticação e para aplicações web. 

Ele é composto de um servidor implementado em NodeJS e Type ORM. 

Faz parte do projeto um exemplo de front-end desenvolvido em Vue.js, mas que pode ser facilmente substiutuído pelo frameworjk de sua preferência. Escrevi em Vue.js porque é o framework que gosto mais e conheço melhor.

A sigla NETT vem das inicias de Node.Js, Express, Typescript e TypeORM, e o projeto foi criado para fins de aprendizado destas tecnologias.

## Pré Requisitos

Para utiliziar este template você precisará ter instalados em seu ambiente de desenvolvimento:

- **Docker**
- **Node JS**
- Se você utiliza o Windows: **Git Bash** ou outro shell de sua preferência (CmDer, Powershell, etc.)

Opcionalmente pode instalar também o Yarn caso prefira este no lugar do NPM.

## Características

* Autenticação de usuários utilizando tokens JWT;
* Bancos de dados separados para autenticação e cadastro de usuários (authdb) e dados da aplicação (appdata);
* Possibilidade de usar MySQL e/ou PostgreSQL ou ambos ao mesmo tempo separando os bancos de dados de autenticação e da aplicação.

## Instalação

Depois de clonar o repositório siga os passos abaixo para completar a instalação do template:

1. Usando o shell de sua preferência (para quem está usando o Windows recomendo o Git Bash) entrar na pasta do projeto e executar os comandos:

```
npm install
```
2. Gerar uma chave de autenticação executando comando:
```
npm run generate
```
O comando acima irá produzir uma saída com o valor de *secret_key* gerado de forma aleatória. Este será usado para as operações de criptografia do sistema de forma que é recomendável que seja mantida uma cópia desta chave para o caso de necessidade de restauração posterior.

**Observação:** Este comando NÃO foi testado exaustivamente de forma que é possível que ocorra algum erro de file system durante sua execução. Se for este o caso siga as instruções na seção **Chave alteração manual** descrita abaixo.

3. Iniciar o container Docker executando o comando abaixo:
```
docker-compose up -d
```
Aguardar a inicialização dos containers, principalmente o do MySQL (leia obervação abaixo), e depois executar o comando:

```
docker exec -i mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" < /mnt/app/script-mysql.sql'
```

O comando acima irá criar o banco de dados e as tabelas do sistema necessários para uso com o MySQL.

**Observação:** A inicialização do container *mysql* pode demorar, assim, antes de executar o comando verifique se já aparece a mensagem, "*ready for connections*" no log deste container.

4. Iniciar o servidor em modo desenvolvimento executando o comando abaixo:
```
npm run dev
```

## Front End

Para testar o funcionamento do servidor você poderá usar o front end que desenvolvi para ser usado em conjunto com este server.  O projeto do front end está no seguinte reposítporio do GIT Hub:

https://github.com/ewertonvaz/vue-nett-frontend.git

Outra opção é utilizar o Postman acessando os end-points da api que serão descritos abaixo.

### Login

O último passo acima faz com que o servidor node fique ativo na porta 3000. Para fazer o login utilize as credenciais abaixo:

* Email: admin@mysite.com
* Password: secret

Após fazer o login é recomendável que você registre um usuário que será o Administrador, faça o login com este novo usuário e em seguida remova o usuário padrão (name: admin, email: admin@mysite.com).

#### Chave alteração manual

Os passos abaixo devem ser executados SOMENTE no caso de erro durante a execução do comando *npm run generate*

Renomear o arquivo *src\config\settings.example.ts* para *src\config\settings.ts*

Renomear o arquivo *_volumes\scripts\script-mysql.samp.sql* para *_volumes\scripts\script-mysql.sql*

Renomear o arquivo *_volumes/dockerfiles/init.samp.sql* para *_volumes/dockerfiles/init.sql* 

Copiar a chave gerada (a string que é o valor do campo *secret_key*) usando o comando *npm run generate* e inserir a mesma nos arquivos de configuração conforme abaixo:

* *setting.ts* - substituir o valor do campo SECRET_KEY pela chave;

* *script-mysql.sql* - substituir o valor destacado entre aspas, conforme abaixo, pela chave:
  SET @secret_key = CONCAT('**Use o script yarn generate e coloque sua chave secreta aqui**', 'admin@mysite.com');

* *init.sql* - substituir o valor destacado entre aspas, conforme abaixo, pela chave:
  secretkey VARCHAR := CONCAT('**Use o script yarn generate e coloque sua chave secreta aqui**','admin@mysite.com');

  Nestes dois último casos mantenha as aspas, pois a chave será tratada como uma string ou cadeia de caracteres.

## API endpoints

URL: /user

Método: GET

* Lista dos usuários cadastrados

Auth: Sim



URL: /user/login

Método: POST

* Realizar o login usando email e senha. Se bem sucedido recebe um token de autenticação que será usado nas demais requisições.****

Auth: Não



URL: /user/create

Método: POST

* Cria um usuário com os dados (nome, email e senha) informados.  Pode ser informado também o campo is_admin que determina se o usuário que está sendo criado é um administrador. Se bem sucedido retorna para o frontend os dados do usuário que foi criado.

Auth: Sim



URL: /user/update

Método: PUT

* Atualiza os dados de um usuário (somente nome e email, a senha deve ser atualizada por um endpoint específico) informados.  Pode ser informado também o campo is_admin que determina se o usuário que está sendo criado é um administrador. Se bem sucedido retorna para o frontend os dados do usuário atualizado.

Auth: Sim



URL: /user/register

Método: POST

* Permite registrar um novo usuário que, por padrão, NÃO é administrador.

Auth: Não



URL: /user/delete

Método: DELETE

* Excluir um usuário.

Auth: Sim



## Configuração customizada

See [Configuration Reference](https://cli.vuejs.org/config/).

dfhdhhfd

* SECRET_KEY:
* ADM_TOKEN_EXPIRES:
* USER_TOKEN_EXPIRES:
* MYSQL: 
* POSTGRES: 

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

  Alterando esta linha o server passará a utiliziar o PostgreSQL para armazenar os ados de autenticaçãoe  usuários.

Após realizar a alteração será necessário reiniciar o servidor. Note também que somente uma das opções poderá estar ativa em um dado momento. 

Os usuários deverão ser cadastados ou registrar-se novamente após a troca do SGBD.

### Alterar a conexão Type ORM

Editar o arquivo *src\shared\orm\appdata.connect.ts* e modificar os seguinte parâmetros:

* type: 
* host:
* port:
* password:
* username:

