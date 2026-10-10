CREATE DATABASE IF NOT EXISTS achados_perdidos
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE achados_perdidos;

CREATE TABLE IF NOT EXISTS objeto (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    local VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    status VARCHAR(255) NOT NULL
);
