# Sistema de Gestión de Cédulas

Este proyecto es una aplicación interna desarrollada para el **SAIME de Venezuela**. Permite la gestión de documentos, usuarios y otros procesos administrativos relacionados con la organización.

## Características

- **Gestión de Documentos**: Registro, búsqueda y organización de documentos por nombre o cédula.
- **Gestión de Usuarios**: Administración de roles y usuarios del sistema.
- **Interfaz Intuitiva**: Navegación sencilla con un diseño responsivo.
- **Seguridad**: Autenticación con NextAuth, control por rol y hash de contraseñas.

## Tecnologías Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/) con React.
- **Backend**: API construida con Route Handlers de Next.js App Router.
- **Base de Datos**: Firebase Firestore.
- **Autenticación**: NextAuth (CredentialsProvider).
- **Despliegue**: [Vercel](https://vercel.com/).

## Requisitos Previos

- Node.js (v16 o superior)
- Proyecto Firebase con Firestore habilitado

## Configuración del Proyecto

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/necho1122/control-cedulas-saime.git
   cd control-cedulas-saime
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     NEXTAUTH_SECRET=...
     NEXTAUTH_URL=http://localhost:3000
     FIREBASE_PROJECT_ID=...
     FIREBASE_CLIENT_EMAIL=...
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
     ```

4. **Crear el primer administrador**:
   - Inicia el proyecto con `npm run dev`.
   - Abre `http://localhost:3000/setup`.
   - Crea el primer usuario Admin.
   - Inicia sesión en `http://localhost:3000/login`.

5. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**:
   - Abre tu navegador y ve a `http://localhost:3000`.

## Despliegue en Vercel

1. **Conectar el repositorio**:
   - Sube el proyecto a un repositorio en GitHub, GitLab o Bitbucket.
   - Conecta el repositorio a Vercel.

2. **Configurar variables de entorno**:
   - En el panel de Vercel, ve a **Settings > Environment Variables** y agrega:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     NEXTAUTH_SECRET=...
     NEXTAUTH_URL=https://tu-dominio.vercel.app
     FIREBASE_PROJECT_ID=...
     FIREBASE_CLIENT_EMAIL=...
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
     ```

3. **Hacer el deploy**:
   - Vercel detectará automáticamente que es un proyecto de Next.js y realizará el despliegue.

## Estructura del Proyecto

```
├── app/
│   ├── api/               # Endpoints de la API
│   ├── login/             # Acceso de usuarios
│   ├── setup/             # Bootstrap del primer admin
│   ├── organizacion/      # Página de organización
│   ├── administracion/    # Página de administración
│   └── layout.tsx         # Layout principal
├── lib/
│   ├── auth.ts            # Configuración de NextAuth
├── middleware.ts          # Protección de rutas administrativas
├── .env.local             # Variables de entorno (no incluido en el repositorio)
├── .gitignore             # Archivos ignorados por Git
├── README.md              # Documentación del proyecto
```

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. Sube tus cambios:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un Pull Request en el repositorio original.

## Licencia

Este proyecto es de uso interno y no está destinado para distribución pública.

---
