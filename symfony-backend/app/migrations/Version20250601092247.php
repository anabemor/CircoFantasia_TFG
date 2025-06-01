<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250601092247 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE mensaje_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE mensaje (id INT NOT NULL, nombre VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, telefono VARCHAR(20) DEFAULT NULL, asunto VARCHAR(50) NOT NULL, contenido TEXT NOT NULL, fecha TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, respondido BOOLEAN NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE mensaje_id_seq CASCADE');
        $this->addSql('DROP TABLE mensaje');
    }
}
