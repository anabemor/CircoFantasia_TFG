# Proyecto TFG CircoFantasia

Desarrollo de una Aplicación de Gestión de Reservas para “Circo Escuela Fantasía”

## Introducción
Circo Escuela Fantasía es un centro de ocio dedicado a la organización de actividades lúdico-educativas dirigidas tanto a centros escolares como a familias. A lo largo del año, ofrece una variedad de experiencias temáticas estructuradas en cuatro categorías principales: 🎭 Un Día en el Circo, 🐮 Granja Escuela de Caperucita, 🎃 Halloween Kids Party y 🎅 La Fábrica de Papá Noel.
    
Con más de diez años de trayectoria, el centro ha experimentado un crecimiento constante en la demanda de sus actividades. No obstante, a pesar de su éxito, la empresa aún no cuenta con una aplicación propia que facilite la gestión de reservas de manera eficiente y accesible. Hace un año, se implementó un sistema de reservas en línea a través de una plataforma genérica. Sin embargo, esta opción ha resultado ser poco intuitiva para los usuarios y con un coste elevado.

Por este motivo, surge la necesidad de desarrollar una aplicación a medida que optimice la gestión de reservas, ofreciendo una interfaz intuitiva para los clientes y un entorno de administración sencillo y eficiente. Esta nueva herramienta deberá mantener una coherencia visual con la identidad corporativa del centro y garantizar un sistema robusto que contemple todas las necesidades del usuario, cumpla con los estándares de seguridad y sea capaz de gestionar altas cargas de demanda sin afectar su rendimiento.
__________

## 👪 Público Objetivo
Dirigida a centros escolares y familias. 
____________

## 🖥️ Apps Similares
Turitop
________________

## 🎯 Características de CircoFantasia
Las funcionalidades del proyecto Circo Escuela Fantasía deberían centrarse en la gestión eficiente de reservas, la interacción con los usuarios y la administración de eventos. Así las funcionalidades de la aplicación serán:

### ✅ Gestión de Reservas
▪️ **Reserva Online de Actividades**: Permitir a los usuarios seleccionar y reservar eventos según disponibilidad.

▪️ **Calendario de Eventos**: Vista organizada de fechas y horarios disponibles.

▪️ **Gestión de Aforos**: Control de plazas disponibles para cada actividad.

▪️ **Confirmación y Notificaciones**: Envío de correos o mensajes para confirmar reservas y enviar recordatorios.

▪️ **Historial de Reservas**: Los usuarios pueden consultar sus reservas pasadas y futuras.
____________________

### 👦 Gestión de Usuarios
▪️ **Registro e Inicio de Sesión**: Para clientes y administradores.

▪️ **Perfiles de Usuario**: Almacenar datos básicos y preferencias.

▪️ **Diferenciación de Roles**: Administradores, colegios, familias, etc.
_________________

### 🥳 Administración de Eventos

▪️ **Creación y Edición de Actividades**: Los administradores pueden añadir, modificar o eliminar eventos.

▪️ **Configuración de Precios y Descuentos**: Personalización de tarifas según el tipo de usuario.

▪️ **Control de Asistencia**: Lista de participantes y posibilidad de gestionar cancelaciones.
______________________
### 💳 Métodos de Pago

▪️ **Pasarela de Pago Segura**: Pago online con tarjeta, PayPal o transferencia.

▪️ **Facturación Automática**: Generación de recibos o facturas.
___________________

### 📢 Comunicación y Soporte

▪️ **Chat o Formulario de Contacto**: Para resolver dudas sobre eventos o reservas.

▪️ **Sistema de Opiniones y Valoraciones**: Los usuarios pueden dejar reseñas sobre su experiencia.

▪️ **Notificaciones Push**: Avisos sobre cambios, promociones o recordatorios de eventos.

_________________________
### 🎨Diseño y Experiencia de Usuario

▪️ **Interfaz Intuitiva, Adaptada Y Responsiva**: Fácil de usar tanto en móviles, tablets u ordenadores.

▪️ **Diseño en Línea con la Identidad del Circo**: Colores, imágenes y tipografías coherentes con la marca.
__________________

### 🔒 Seguridad y Rendimiento

▪️ **Autenticación Segura**: Protección de datos personales.

▪️ **Optimización para Altas Demandas**: Que la app funcione bien en picos de tráfico.

▪️ **Cumplimiento con Regulaciones (GDPR, LOPD, etc.)**: Protección de datos personales de los usuarios.
_____________________

### 📌 Extras Opcionales

▪️ **Sistema de Fidelización**: Descuentos o puntos por repetir reservas.

▪️ **Modo Offline**: Para que administradores puedan gestionar reservas sin conexión.

▪️ **Integración con Redes Sociales**: Para compartir eventos fácilmente.
__________________________

## 🛠️ Stack Tecnológico y Lenguajes

Teniendo en cuenta que, por tiempo y poca experiencia, no voy a poder desarrollar la aplicación completa, me centraré solo en los tres pilares fundamentales: frontend, backend y base de datos. “Métodos de pago” lo sustituiré por una simulación mediante un monedero digital. Dejaré para más adelante el método de pago real, la “Comunicación y Soporte”, la “Seguridad y Rendimiento” y los extras. 
(Propuesta)

Necesitamos un stack tecnológico que proporcione flexibilidad, escabilidad y seguridad a la aplicación.

🔹**Frontend**: Angular + Tailwind CSS  ➡️	TypeScript

🔹**Backend**: Synfony ➡️	 JavaScript/TypeScript

🔹**Base de Datos**: PostgreSQL ➡️	 SQL  

________

Para ejecución de proyecto en real: 

🔹**Autenticación**: JWT + OAuth 2.0  ➡️ JavaScript/TypeScript

🔹**Pagos**: Stripe ➡️	 JavaScript/TypeScript 

🔹**Notificaciones**: Firebase Cloud Messaging (FCM) ➡️	JavaScript/TypeScript

🔹**Infraestructura**: AWS + Docker ➡️	 Bash/Shell

🔹**Seguridad**: HTTPS + bcrypt + OWASP ➡️	 JavaScript/TypeScript
___________

## Planning Board
____________

________

# 📚 Despliegue de una Aplicación Symfony y Angular con Docker Compose
Este proyecto utiliza Docker y Docker Compose para desplegar una aplicación que incluye un backend Symfony, un frontend Angular y una base de datos PostgreSQL de manera rápida y sencilla.

---

## 🛠️ Requisitos Previos
Antes de comenzar, asegúrate de tener instalados en tu sistema:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
---

## 🚀 Instalación y Puesta en Marcha

### 1️⃣ Clonar el repositorio
Ejecuta el siguiente comando para clonar el proyecto:
```bash
git clone git@github.com:campus-CodeArts/Onboarding-SymfAngular.git
cd Onboarding-SymfAngular
```

### 2️⃣ Levantar los contenedores
Para iniciar los servicios en segundo plano, ejecuta:
```bash
docker-compose up -d
```
📌 **Nota:** La primera vez que inicies los servicios, puede tardar unos minutos en configurarse completamente.

### 3️⃣ Verificar que los contenedores están corriendo
Comprueba el estado de los contenedores con:
```bash
docker ps
```
Deberías ver tres contenedores en ejecución: **PostgreSQL**, **Symfony (backend)** y **Angular (frontend)**.

### 4️⃣ Acceder a la aplicación
- **Frontend:** Abre la siguiente URL en tu navegador:
  ```
  http://localhost:4200
  ```
- **Backend (Symfony):** Puedes ver la salida de Symfony desde:
  ```
  http://localhost:8000
  ```
- **Base de datos PostgreSQL:** El contenedor de la base de datos está en el puerto 5432, aunque normalmente no es necesario acceder directamente a este servicio en un navegador.

---

## 🔄 Detener y Reiniciar los Contenedores
Si deseas detener los contenedores en ejecución:
```bash
docker-compose down
```
Para volver a iniciarlos:
```bash
docker-compose up -d
```

---

## 🧹 Eliminar los Contenedores y Datos Persistentes
Si quieres eliminar los contenedores junto con los volúmenes y datos almacenados:
```bash
docker-compose down -v
```
⚠️ **Advertencia:** Esto eliminará todos los datos almacenados en la base de datos PostgreSQL.

---

## 🎯 Notas Finales
- Para ver los registros en tiempo real:
  ```bash
  docker-compose logs -f
  ```

Para más información sobre **Symfony**, **Angular** o **PostgreSQL**, consulta sus respectivas documentaciones oficiales.

## Comandos útiles

- Para acceder al contenedor del Frontend Angular:
```
  docker exec -it angular_frontend sh
```

- Para acceder al contenedor del Backend Symfony:
```
docker exec -it symfony_backend bash
```
- Si no tienes problemas de permisos para levantar un contenedor, prueba a ejecutar el siguiente comando:

```
sudo chmod 775 -R (contenedor_de_Symfony_o_Angular_frontend)
Ej:
sudo chmod 775 -R angular-frontend
```
