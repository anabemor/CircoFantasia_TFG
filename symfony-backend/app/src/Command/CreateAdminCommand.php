<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'create:admin',
    description: 'Crea un nuevo usuario con rol ADMIN',
)]
class CreateAdminCommand extends Command
{
    private string $email;
    private string $password;
    private string $name;

    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function interact(InputInterface $input, OutputInterface $output)
    {
        $helper = $this->getHelper('question');

        $this->email = $helper->ask($input, $output, new Question('Email: '));
        $this->password = $helper->ask($input, $output, new Question('Contraseña: '));
        $this->name = $helper->ask($input, $output, new Question('Nombre: '));
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $user = new User();
        $user->setEmail($this->email);
        $user->setName($this->name);
        $user->setRoles(['ROLE_ADMIN']);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $this->password);
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        $output->writeln('<info>✅ Usuario admin creado con éxito.</info>');

        return Command::SUCCESS;
    }
}