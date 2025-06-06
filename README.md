# 🎪 TickFantasia

**TickFantasia** es una aplicación web para la gestión y compra de entradas de espectáculos del Circo Escuela Fantasía. Está compuesta por un frontend desarrollado en Angular 19 y un backend en Symfony 6.4, desplegados mediante Docker y con base de datos PostgreSQL.

---

## 🧱 Estructura del Proyecto

```
.
├── angular-frontend/      # Interfaz pública y panel de administración (Angular 19 + Tailwind 4)
├── symfony-backend/       # Lógica del backend y API REST (Symfony 6.4)
├── docker-compose.yml     # Orquestador de contenedores
└── README.md              # Este archivo
```

### `angular-frontend/`

Aplicación cliente desarrollada con Angular 19. Usa Tailwind CSS para estilos y Angular Material para componentes visuales. Incluye un sistema de reservas para clientes y un panel privado de administración.

Dependencias clave:

```json
"@angular/core": "^19.2.9",
"@angular/material": "^19.2.16",
"tailwindcss": "^4.0.10"
```

Se lanza con:

```bash
npm start  # o ejecutado por Docker en el puerto 4200
```

### `symfony-backend/`

API RESTful construida en Symfony 6.4. Gestiona usuarios, actividades, reservas y mensajes. Usa Doctrine ORM con PostgreSQL.

Rutas destacadas:

```php
#[Route('/api/register', name: 'api_register', methods: ['POST'])]
#[Route('/api/reservas', methods: ['POST'])]
```

### `docker-compose.yml`

Orquesta tres contenedores: backend Symfony, base de datos PostgreSQL y frontend Angular.

```yaml
services:
  backend:
    build: ./symfony-backend
    ports: ["8000:8000"]

  db:
    image: postgres:13
    environment:
      POSTGRES_USER: tickfantasia_user
      POSTGRES_PASSWORD: tickfantasia_password
      POSTGRES_DB: tickfantasia_db
    ports: ["5432:5432"]

  frontend:
    build: ./angular-frontend
    ports: ["4200:4200"]
```

---

## ⚙️ Archivos de configuración relevantes

### `.env` (backend)

Define la conexión a la base de datos:

```
DATABASE_URL="postgresql://tickfantasia_user:tickfantasia_password@db:5432/tickfantasia_db?serverVersion=13&charset=utf8"
```

### `Dockerfile` (backend)

Instalación de PHP 8.2 con extensiones necesarias:

```Dockerfile
FROM php:8.2-apache
RUN docker-php-ext-install intl mbstring zip pdo_pgsql
COPY ./docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
```

---

## 📦 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js y npm (solo si deseas trabajar fuera de Docker)
- Git (para clonar el repositorio)

---

## 🚀 Puesta en marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/tickfantasia.git
cd tickfantasia
```

### 2. Levanta los contenedores

```bash
docker-compose up --build
```

Esto iniciará:
- El frontend en [http://localhost:4200](http://localhost:4200)
- El backend en [http://localhost:8000](http://localhost:8000)

### 3. Accede a la aplicación

- **Cliente**: http://localhost:4200
- **API REST**: http://localhost:8000/api

---

## 🧪 Uso básico

- El cliente puede comprar entradas desde la interfaz pública.
- El administrador accede al panel privado para gestionar usuarios, actividades, reservas y mensajes.
- Las reservas se registran con validación de aforo.
- El backend expone endpoints REST para las operaciones CRUD principales.

---

## 📄 Licencia

Este proyecto es parte del trabajo académico para el Circo Escuela Fantasía. Uso interno y demostrativo.

---
