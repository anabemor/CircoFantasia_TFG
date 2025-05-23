<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250523082550 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE reserva_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reserva_ticket_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE ticket_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE reserva (id INT NOT NULL, nombre VARCHAR(255) NOT NULL, apellidos VARCHAR(255) NOT NULL, fecha_nacimiento DATE NOT NULL, email VARCHAR(255) NOT NULL, telefono VARCHAR(255) NOT NULL, fecha_visita DATE NOT NULL, fecha_reserva TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, acepto_condiciones BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE reserva_ticket (id INT NOT NULL, reserva_id INT NOT NULL, ticket_type_id INT NOT NULL, cantidad INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_258AD49DD67139E8 ON reserva_ticket (reserva_id)');
        $this->addSql('CREATE INDEX IDX_258AD49DC980D5C1 ON reserva_ticket (ticket_type_id)');
        $this->addSql('CREATE TABLE ticket_type (id INT NOT NULL, nombre VARCHAR(255) NOT NULL, precio DOUBLE PRECISION NOT NULL, activo BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE reserva_ticket ADD CONSTRAINT FK_258AD49DD67139E8 FOREIGN KEY (reserva_id) REFERENCES reserva (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reserva_ticket ADD CONSTRAINT FK_258AD49DC980D5C1 FOREIGN KEY (ticket_type_id) REFERENCES ticket_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE reserva_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reserva_ticket_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE ticket_type_id_seq CASCADE');
        $this->addSql('ALTER TABLE reserva_ticket DROP CONSTRAINT FK_258AD49DD67139E8');
        $this->addSql('ALTER TABLE reserva_ticket DROP CONSTRAINT FK_258AD49DC980D5C1');
        $this->addSql('DROP TABLE reserva');
        $this->addSql('DROP TABLE reserva_ticket');
        $this->addSql('DROP TABLE ticket_type');
    }
}
