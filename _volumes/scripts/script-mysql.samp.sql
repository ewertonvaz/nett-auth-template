CREATE DATABASE `appdata`;
CREATE DATABASE `authdb`;
USE `authdb`;

CREATE TABLE `user` (
  `uuid` varchar(128) DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar (255) NOT NULL,
  `user_token` varchar(255) NULL,
  `email_validated` BOOLEAN NOT NULL DEFAULT 0,
  `is_admin` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `email` (`email`)
);

SET @secret_key = CONCAT('Use o script yarn generate e coloque sua chave secreta aqui', 'admin@mysite.com');
SET @crypt_str = HEX(AES_ENCRYPT('secret', @secret_key, 512));
INSERT INTO `authdb`.`user` (`name`, `email`, `password`, `is_admin`) VALUES ('admin', 'admin@mysite.com', @crypt_str, 1);