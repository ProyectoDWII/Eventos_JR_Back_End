# Contexto y Estructura del Backend - Eventos JR

Este documento proporciona una descripción detallada de la arquitectura, base de datos, endpoints actuales, patrones de diseño y guías de conexión para el frontend de la API de **Eventos JR**. Está diseñado para que cualquier desarrollador o agente de IA pueda entender el estado actual del proyecto y continuar con su desarrollo de forma inmediata.

---

## 1. Arquitectura General y Tecnologías

El backend está desarrollado sobre la plataforma **Node.js** utilizando el framework **Express**. Utiliza una arquitectura orientada a capas:
*   **Modelos (Mongoose)**: Definición de esquemas de datos y validaciones a nivel de MongoDB.
*   **Repositorios**: Capa de abstracción para consultas a la base de datos (Patrón Repository).
*   **Controladores**: Lógica de control para peticiones HTTP (se conecta con los modelos o repositorios).
*   **Rutas**: Definición de endpoints HTTP y aplicación de middlewares.
*   **Middlewares**: Interceptores globales o locales (autenticación JWT, validación de roles, manejo de errores).
*   **Servicios**: Funcionalidades auxiliares y de terceros (JWT, emails, chatbot, PDF).
*   **Validadores (Joi)**: Esquemas de validación estructural para las peticiones entrantes.

### Dependencias Principales (`package.json`)
*   `express` (^5.2.1): Framework web.
*   `mongoose` (^9.7.3): ODM para MongoDB.
*   `jsonwebtoken` (^9.0.3): Creación y verificación de tokens de sesión.
*   `bcryptjs` (^3.0.3): Encriptación de contraseñas.
*   `cors` (^2.8.6): Control de acceso HTTP (CORS).
*   `joi` (^18.2.3): Validación de datos de entrada.
*   `express-validator` (^7.3.2): Validación de datos de entrada integrada en rutas Express.
*   `dotenv` (^17.4.2): Carga de variables de entorno.
*   `nodemon` (^3.1.14): Recarga automática en desarrollo.

---

## 2. Estructura de Directorios

El código fuente principal se encuentra en la carpeta `src/`. A continuación, se detalla el propósito de cada directorio:

```text
Eventos_JR_Back_End/
├── .env.example              # Plantilla para variables de entorno (Ojo: ver sección de setup)
├── package.json              # Configuración y dependencias del proyecto
├── src/
│   ├── app.js                # Configuración de Express (middlewares globales y enrutador principal)
│   ├── server.js             # Punto de entrada (inicializa DB y enciende el servidor)
│   ├── config/               # Configuraciones (Base de datos, JWT, Cohere, etc.)
│   ├── controller/           # Controladores de la lógica de negocio (por ej. CRUD de usuarios)
│   ├── jobs/                 # Tareas automáticas en segundo plano (limpieza, recordatorios)
│   ├── middleware/           # Middlewares de seguridad, roles, subida de archivos y errores
│   ├── models/               # Modelos/esquemas de Mongoose para MongoDB
│   ├── repositories/         # Capa de repositorios para aislamiento de consultas de BD
│   ├── routes/               # Enrutadores divididos por módulos (auth, admin, client, etc.)
│   ├── service/              # Servicios de lógica específica (Token, PDF, email, chatbot AI)
│   ├── sockets/              # Configuración de sockets en tiempo real (por ej. chat)
│   ├── templates/            # Plantillas HTML para correos y plantillas EJS para PDFs
│   ├── utils/                # Utilidades, formateadores y constantes del sistema
│   └── validators/           # Esquemas Joi para la validación de peticiones
└── tests/                    # Pruebas automatizadas (unitarias, integración y fixtures)
```

---

## 3. Configuración y Variables de Entorno (`.env`)

> [!IMPORTANT]
> **Estado de la Configuración (.env):**
> Ya se ha configurado el archivo `.env` en la raíz del backend utilizando tus credenciales de MongoDB Atlas reales y la configuración de puerto.
>
> El contenido actual configurado en el archivo `.env` es:
> ```env
> PORT=3000
> MONGODB_URI=mongodb+srv://31loredo:Patito123@cluster0.9afzxpg.mongodb.net/?appName=Cluster0
> NODE_ENV=development
> JWT_SECRET=tu_clave_secreta_muy_segura
> JWT_EXPIRES_IN=7d
> ```
>
> *(Nota: Se ha corregido el nombre de la variable a `MONGODB_URI` tal como lo requieren `server.js` y `database.js` para evitar discrepancias con el `MONGO_URI` listado en `.env.example`).*

### Ejecutar el Proyecto
Instalar dependencias:
```bash
npm install
```

Iniciar en modo desarrollo (recarga automática con nodemon):
```bash
npm run dev
```

Iniciar en modo producción:
```bash
npm start
```

---

## 4. Modelos de Base de Datos (Mongoose)

Se tienen definidos 5 esquemas principales en `src/models/`:

### 4.1. Usuario (`user.js`)
Representa a los usuarios del sistema (Clientes y Administradores).
*   `name` (String, requerido): Nombre del usuario.
*   `email` (String, requerido, único, minúsculas): Correo electrónico.
*   `password` (String, requerido, oculto por defecto `select: false`): Contraseña hash.
*   `role` (String, enum, default: `'client'`): Rol del usuario, puede ser `'admin'` o `'client'`.
*   `phoneNumber` (String, opcional): Número de contacto.
*   `status` (String, enum, default: `'active'`): Estado de cuenta, puede ser `'active'` o `'inactive'`.
*   `deletedAt` (Date, default: `null`): Fecha de baja suave (soft delete).
*   **Métodos del Schema**:
    *   `comparePassword(password)`: Compara la contraseña en texto plano contra el hash de la BD.
    *   `softDelete()`: Registra la fecha de eliminación y desactiva la cuenta.
    *   `restore()`: Restablece el estado de eliminación a nulo y activa la cuenta.
*   **Middleware pre-find**: Excluye automáticamente documentos que tengan `deletedAt !== null` a menos que se especifique `{ includeDeleted: true }` en las opciones de consulta de Mongoose.

### 4.2. Solicitud (`aplication.js`)
Representa una solicitud de reserva/planificación de evento enviada por un cliente.
*   `client` (ObjectId -> User, requerido): Cliente que genera la solicitud.
*   `eventType` (String, requerido): Tipo de evento (ej. "Boda", "Graduación").
*   `eventDate` (Date, requerido): Fecha programada del evento.
*   `location` (String, requerido): Dirección física del evento.
*   `package` (ObjectId -> Package, opcional): Paquete de servicios predefinido seleccionado.
*   `services` (Array de ObjectIds -> Service): Servicios adicionales individuales incluidos en la solicitud.
*   `status` (String, enum, default: `'pending'`): Estado de la solicitud (`'pending'`, `'approved'`, `'rejected'`, `'cancelled'`).
*   `notes` (String, opcional): Comentarios o requisitos especiales del cliente.

### 4.3. Contrato (`contract.js`)
Vincula un acuerdo contractual y estado financiero a una solicitud de evento aprobada.
*   `solicitud` (ObjectId -> Solicitud, requerido, único): Solicitud asociada (Relación 1 a 1).
*   `client` (ObjectId -> User, requerido): Cliente titular del contrato.
*   `totalAmount` (Number, requerido, mínimo 0): Costo monetario total acordado.
*   `paymentStatus` (String, enum, default: `'pending'`): Estado de los pagos (`'pending'`, `'partial'`, `'paid'`).
*   `terms` (String, requerido): Términos legales del contrato.
*   `pdfUrl` (String, default: `''`): Enlace al documento PDF generado.
*   `status` (String, enum, default: `'draft'`): Estado del contrato (`'draft'`, `'active'`, `'signed'`, `'completed'`, `'cancelled'`).
*   `signedAt` (Date, default: `null`): Fecha exacta de la firma por parte del cliente.

### 4.4. Paquete (`package.js`)
Planes preestablecidos compuestos por varios servicios que los clientes pueden elegir.
*   `name` (String, requerido, único): Nombre comercial del paquete (ej. "Paquete Premium").
*   `description` (String, requerido): Descripción de lo que incluye.
*   `price` (Number, requerido, mínimo 0): Precio total con descuento por paquete.
*   `services` (Array de ObjectIds -> Service): Servicios por defecto o sugeridos que incluye el paquete.
*   `status` (String, enum, default: `'active'`): Estado del paquete (`'active'`, `'inactive'`).

### 4.5. Servicio (`service.js`)
Servicios individuales disponibles para contratación o composición de paquetes.
*   `name` (String, requerido, único): Nombre del servicio (ej. "Sesión Fotográfica 4K").
*   `description` (String, requerido): Detalles técnicos del servicio.
*   `price` (Number, requerido, mínimo 0): Precio individual.
*   `category` (String, requerido, enum): Categoría del servicio (`'photography'`, `'catering'`, `'music'`, `'decoration'`, `'other'`).
*   `status` (String, enum, default: `'active'`): Estado del servicio (`'active'`, `'inactive'`).

---

## 5. Middleware y Seguridad

El backend implementa middlewares clave para asegurar rutas en `src/middleware/`:

1.  **`authMiddleware.js` (Autenticación)**:
    *   Extrae el token del header `Authorization` usando el formato `Bearer <Token>`.
    *   Verifica la validez y vigencia del JWT a través de `tokenService`.
    *   Si es válido, decodifica el token e inyecta la información del payload en `req.user` (`{ id, email, role, iat, exp }`).
    *   Si el token expiró o es inválido, retorna una respuesta `401 Unauthorized`.
2.  **`roleMiddleware.js` (Autorización de roles)**:
    *   Recibe un arreglo de roles autorizados (ej: `['admin']`).
    *   Verifica si el rol en `req.user.role` está en la lista permitida.
    *   Si el rol no coincide, retorna un error `403 Forbidden` (Acceso denegado: rol insuficiente).
3.  **`errorMiddleware.js` / Global Error Handler**:
    *   Maneja errores no capturados en el flujo de Express.
    *   Si la aplicación está en modo `development` (definido en `.env`), la respuesta incluirá la traza completa del error (`stack`), de lo contrario devolverá un mensaje genérico de error de servidor con código `500` o el código de estado correspondiente.

---

## 6. Inventario de Endpoints (Rutas)

Los endpoints están expuestos bajo el prefijo `/api` y se agrupan en las siguientes categorías en `src/app.js`:

### 6.1. Autenticación (`/api/auth`)
Definido en [authRoutes.js](file:///c:/Users/diego%20pardo/Documents/ing%203/barron/Unidad%203/intrumento/Eventos_JR_Back_End/src/routes/authRoutes.js). Libre de autenticación.

*   `POST /api/auth/register` (Registro de usuarios)
    *   **Validaciones (Body)**:
        *   `email`: Debe ser un correo válido.
        *   `password`: Mínimo 6 caracteres.
        *   `name`: Obligatorio.
    *   **Body JSON**:
        ```json
        {
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "password": "segura123password",
          "role": "client", // Opcional, por defecto "client"
          "phoneNumber": "1234567890" // Opcional
        }
        ```
    *   **Respuesta Exitosa (201 Created)**:
        ```json
        {
          "message": "Usuario registrado exitosamente",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "id": "64a4b1...",
            "email": "juan@example.com",
            "name": "Juan Pérez",
            "role": "client"
          }
        }
        ```
*   `POST /api/auth/login` (Inicio de sesión)
    *   **Validaciones (Body)**:
        *   `email`: Correo válido (Obligatorio).
        *   `password`: Obligatorio.
    *   **Body JSON**:
        ```json
        {
          "email": "juan@example.com",
          "password": "segura123password"
        }
        ```
    *   **Respuesta Exitosa (200 OK)**:
        ```json
        {
          "message": "Login exitoso",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "id": "64a4b1...",
            "email": "juan@example.com",
            "name": "Juan Pérez",
            "role": "client"
          }
        }
        ```

### 6.2. Cliente (`/api/client`)
Definido en [clientRoutes.js](file:///c:/Users/diego%20pardo/Documents/ing%203/barron/Unidad%203/intrumento/Eventos_JR_Back_End/src/routes/clientRoutes.js). **Protegido con JWT** (`authMiddleware`) y con restricción de rol (`roleMiddleware(['client'])`).
Actualmente son endpoints tipo borrador para validar el acceso:

*   `GET /api/client/dashboard`
    *   **Respuesta**: `{ success: true, message: 'Dashboard del cliente', user: { ... } }`
*   `GET /api/client/profile`
    *   **Respuesta**: `{ success: true, message: 'Perfil del cliente', user: { ... } }`

### 6.3. Administrador - CRUD de Usuarios (`/api/admin`)
Definido en [adminRoutes.js](file:///c:/Users/diego%20pardo/Documents/ing%203/barron/Unidad%203/intrumento/Eventos_JR_Back_End/src/routes/adminRoutes.js). **Protegido con JWT** y restringido a administradores (`roleMiddleware(['admin'])`). Conectado con [userController.js](file:///c:/Users/diego%20pardo/Documents/ing%203/barron/Unidad%203/intrumento/Eventos_JR_Back_End/src/controller/userController.js).

*   `GET /api/admin/users` (Listar todos los usuarios activos)
    *   **Respuesta (200 OK)**: `{ success: true, count: N, data: [ ... ] }`
*   `GET /api/admin/users/:id` (Obtener un usuario por ID)
    *   **Validación (Param)**: `:id` debe ser un MongoId válido.
    *   **Respuesta (200 OK)**: `{ success: true, data: { ... } }`
*   `PUT /api/admin/users/:id` (Actualizar información de un usuario)
    *   **Validación (Param)**: `:id` debe ser MongoId.
    *   **Validaciones opcionales (Body)**: `name` no vacío, `email` válido, `status` enum ('active', 'inactive').
    *   **Respuesta (200 OK)**: `{ success: true, message: 'Usuario actualizado exitosamente', data: { ... } }`
*   `PATCH /api/admin/users/:id/rol` (Cambiar el rol de un usuario)
    *   **Validaciones**: `:id` (MongoId), `role` (enum: 'admin' o 'client' en body).
    *   *Nota*: Previene la pérdida del último administrador disponible en el sistema.
    *   **Respuesta (200 OK)**: `{ success: true, message: 'Rol actualizado exitosamente', data: { ... } }`
*   `DELETE /api/admin/users/:id` (Baja lógica / Soft Delete de un usuario)
    *   **Validaciones**: `:id` (MongoId).
    *   *Nota*: Desactiva el usuario y guarda la fecha actual en `deletedAt`. Previene eliminar al último administrador.
    *   **Respuesta (200 OK)**: `{ success: true, message: 'Usuario eliminado exitosamente', data: { id, name, deletedAt } }`
*   `PATCH /api/admin/users/:id/restore` (Restaurar un usuario eliminado)
    *   **Validaciones**: `:id` (MongoId).
    *   *Nota*: Vuelve a poner `deletedAt: null` y `status: 'active'`.
    *   **Respuesta (200 OK)**: `{ success: true, message: 'Usuario restaurado exitosamente', data: { id, name, restoredAt } }`

---

## 7. Patrón de Diseño: Repositorios (Repository Pattern)

El proyecto cuenta con una capa de abstracción de datos en `src/repositories/`. Aunque actualmente los controladores como `userController` llaman directamente al modelo de Mongoose, el diseño está estructurado para migrar las operaciones hacia los repositorios correspondientes para separar responsabilidades y facilitar pruebas unitarias.

### 7.1. Repositorio Base (`baseRepository.js`)
Una clase base genérica que provee los métodos CRUD estándar:
*   `create(data)`
*   `findById(id, populateFields)`
*   `find(filter, populateFields, options)`
*   `findOne(filter, populateFields)`
*   `update(id, data)`
*   `delete(id)` (Baja física por ID)

### 7.2. Repositorios Específicos
Heredan de `BaseRepository` y contienen métodos adicionales de consulta:

*   **`UserRepository`** (`userRepository.js`):
    *   `findByEmail(email)`: Búsqueda exacta e insensible a mayúsculas.
    *   `findByEmailWithPassword(email)`: Trae el usuario con la contraseña explícita (para flujo de login).
    *   `findByRole(role)`: Trae usuarios activos por rol.
*   **`SolicitudRepository`** (`solicitudRepository.js`):
    *   `findByIdWithDetails(id)`: Trae la solicitud cargando (populating) el Cliente, Paquete y Servicios.
    *   `findWithDetails(filter, options)`: Búsqueda general con relaciones pobladas.
    *   `findByClientId(clientId)`: Historial de solicitudes de un cliente ordenado por fecha de creación descendente.
    *   `updateStatus(id, status)`: Actualiza de forma directa el estado de la reserva.
*   **`ContratoRepository`** (`contratoRepository.js`):
    *   `findByIdWithDetails(id)`: Carga el Contrato con el Cliente y la Solicitud.
    *   `findByClientId(clientId)`: Listado de contratos de un cliente.
    *   `findBySolicitudId(solicitudId)`: Recupera el contrato asociado a una reserva.
    *   `updatePaymentStatus(id, paymentStatus)`: Cambia el estado financiero del contrato.
    *   `updateContractStatus(id, status, signedAt)`: Actualiza el estado legal y opcionalmente añade fecha de firma.
*   **`PaqueteRepository`** (`paqueteRepository.js`):
    *   `findByIdWithServices(id)`: Detalle de un paquete con sus servicios incluidos.
    *   `findActivePackages()`: Listado público de paquetes activos ordenados de menor a mayor precio.
*   **`ServicioRepository`** (`servicioRepository.js`):
    *   `findByCategory(category)`: Listado de servicios de una categoría específica (ej. fotografía) ordenados por precio.
    *   `findActiveServices()`: Listado de todos los servicios activos disponibles por orden alfabético.

---

## 8. Conexión con el Frontend

El frontend puede comunicarse con este backend utilizando librerías como `axios` o la API nativa de JavaScript `fetch`.

### 8.1. Configuración de CORS
El backend incluye la directiva `app.use(cors())` a nivel global en `src/app.js`, lo que habilita la comunicación desde cualquier origen (incluyendo puertos locales comunes de frameworks frontend como React/Vite en `http://localhost:5173` o Angular en `http://localhost:4200`).

### 8.2. Flujo de Autenticación en el Frontend

1.  **Login**: El frontend envía las credenciales mediante `POST`:
    ```javascript
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'usuario@correo.com', password: 'miContraseña' })
    });
    const data = await response.json();
    if (response.ok) {
      // 1. Guardar el token en localStorage o sessionStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    ```

2.  **Llamada a Endpoints Protegidos**: Para cualquier llamada subsiguiente hacia rutas del cliente (`/api/client/*`) o del administrador (`/api/admin/*`), se debe inyectar el token en la cabecera `Authorization`:
    ```javascript
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/api/client/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Formato estándar indispensable
      }
    });
    const data = await response.json();
    ```

3.  **Manejo de Respuestas de Error**:
    *   **`401 Unauthorized`**: El token no es válido o expiró. El frontend debe limpiar el almacenamiento local (`localStorage.removeItem('token')`) y redirigir al usuario al login.
    *   **`403 Forbidden`**: El usuario está autenticado pero no tiene el rol necesario (por ej. un cliente intentando llamar al CRUD de administradores). Mostrar alerta de "Acceso Denegado".

---

## 9. Tareas Pendientes (Roadmap para el Agente)

Para completar el backend y conectarlo con los servicios, se deben desarrollar las siguientes secciones que actualmente se encuentran vacías (0 bytes) o como borradores:

1.  **Implementar los enrutadores específicos**:
    *   Completar e integrar en `app.js` las rutas de reservas (`aplicationRoutes.js`), contratos (`packageRoutes.js`), servicios (`serviceRoutes.js`), notificaciones (`notificationsRoutes.js`) y chat en tiempo real (`chatRoutes.js`).
2.  **Integrar la Capa Repository en Controladores**:
    *   Migrar `userController.js` para usar `UserRepository` en lugar de importar y llamar directamente al modelo `User`.
    *   Crear nuevos controladores (ej: `requestController.js`, `contractController.js`) que utilicen sus respectivos repositorios.
3.  **Implementar Servicios Externos**:
    *   **`chatbotService.js` (IA)**: Lógica para chatear con el modelo de Cohere AI (configurado en `src/config/cohere.js`).
    *   **`emailService.js`**: Integración con un transporte de mensajería (Nodemailer, SendGrid, etc. configurados en `src/config/email.js`) utilizando las plantillas en `src/templates/email/` (`welcome.html`, `rejection.html`, `contract.html`).
    *   **`pdfService.js`**: Lógica de generación automatizada de contratos en PDF a partir del archivo EJS `contractTemplates.ejs` en `src/templates/pdf/`.
4.  **Sockets en tiempo real (`src/sockets/`)**:
    *   Establecer la conexión de Socket.io en `index.js` y `events.js` para habilitar chats en vivo y notificaciones dinámicas al cliente y fotógrafo en tiempo real.
5.  **Cargar y subir archivos (`src/config/multer.js` y `src/middleware/uploadMiddleware.js`)**:
    *   Habilitar la subida de imágenes de eventos y portafolios de fotógrafos.
6.  **Pruebas unitarias y de integración**:
    *   Completar los archivos de prueba en `tests/unit/` (`auth.test.js`, `request.test.js`, `service.test.js`) usando herramientas de testeo.
