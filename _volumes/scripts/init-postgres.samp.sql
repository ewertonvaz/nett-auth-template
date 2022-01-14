CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE DATABASE "appdata";

CREATE TABLE IF NOT EXISTS "user" (
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password TEXT NOT NULL,
    user_token VARCHAR NULL,
    email_validated BOOLEAN NOT NULL DEFAULT false,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uuid),
    UNIQUE (email)
);

DO $$
DECLARE  
   secretkey VARCHAR := CONCAT('Use o script yarn generate e coloque sua chave secreta aqui','admin@mysite.com');  
BEGIN  
   INSERT INTO "user" (name, email, password, is_admin) VALUES ('admin', 'admin@mysite.com', PGP_SYM_ENCRYPT('secret', secretkey ), true);
END $$;