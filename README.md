# Sistema de Gestión de Cédulas

Este proyecto es una aplicación interna desarrollada para el **SAIME de Venezuela**. Permite la gestión de documentos, usuarios y otros procesos administrativos relacionados con la organización.

## Características

- **Gestión de Documentos**: Registro, búsqueda y organización de documentos por nombre o cédula.
- **Gestión de Usuarios**: Administración de roles y usuarios del sistema.
- **Interfaz Intuitiva**: Navegación sencilla con un diseño responsivo.
- **Seguridad**: Manejo de datos sensibles con variables de entorno y buenas prácticas.

## Tecnologías Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/) con React.
- **Backend**: API construida con Next.js y Prisma.
- **Base de Datos**: MySQL.
- **Despliegue**: [Vercel](https://vercel.com/).

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL (servidor accesible)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/quickstart)

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
   - Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
     ```
     DATABASE_URL=mysql://usuario:contraseña@host:puerto/nombre_base_datos
     ```

4. **Configurar Prisma**:
   - Generar el cliente Prisma:
     ```bash
     npx prisma generate
     ```
   - Aplicar migraciones (si es necesario):
     ```bash
     npx prisma migrate deploy
     ```

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
     DATABASE_URL=mysql://usuario:contraseña@host:puerto/nombre_base_datos
     ```

3. **Hacer el deploy**:
   - Vercel detectará automáticamente que es un proyecto de Next.js y realizará el despliegue.

## Estructura del Proyecto

```
├── app/
│   ├── api/               # Endpoints de la API
│   ├── organizacion/      # Página de organización
│   ├── administracion/    # Página de administración
│   └── layout.tsx         # Layout principal
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
├── public/
│   ├── saime-seeklogo.png # Logo del proyecto
├── .env                   # Variables de entorno (no incluido en el repositorio)
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
