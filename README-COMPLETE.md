# 🐾 LexiPet Sentinel - Plataforma Completa

**Ecosistema B2B2C Global de Bioseguridad Veterinaria**

---

## 📋 Tabla de Contenidos
- [Instalación](#instalación)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Features](#features)
- [Módulos](#módulos)
- [API Endpoints](#api-endpoints)
- [Deploy](#deploy)

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 16+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar Repositorio

```bash
git clone https://github.com/cesarojeda1-dot/epidemiological-radar.git
cd epidemiological-radar
git checkout feature/lexipet-platform-v1
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

**Editar `.env.local`:**
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENV=development
```

**Ejecutar:**
```bash
npm run dev
```

→ **http://localhost:5173** ✨

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Editar `.env`:**
```bash
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/lexipet
JWT_SECRET=your_super_secret_jwt_key_here
```

**Ejecutar:**
```bash
npm run dev
```

→ **http://localhost:3001** ✨

---

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos

```bash
psql -U postgres
CREATE DATABASE lexipet;
CREATE USER lexipet_user WITH PASSWORD 'secure_password';
ALTER ROLE lexipet_user SET client_encoding TO 'utf8';
ALTER ROLE lexipet_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lexipet_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE lexipet TO lexipet_user;
\q
```

### 2. Ejecutar Schema SQL

```bash
psql -U lexipet_user -d lexipet -f backend/database.sql
```

Ou si usa conexión remota:
```bash
psql postgresql://lexipet_user:password@localhost:5432/lexipet -f backend/database.sql
```

### 3. Verificar Tablas

```bash
psql -U lexipet_user -d lexipet
\dt  # Ver todas las tablas
\d users  # Ver estructura de tabla users
```

---

## 📁 Estructura del Proyecto

```
epidemiological-radar/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Toast.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Pets.tsx
│   │   │   ├── Farmacia.tsx
│   │   │   ├── Seguros.tsx
│   │   │   ├── Teleconsulta.tsx
│   │   │   └── IASentinel.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   └── toastStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── index.html
├── backend/
│   ├── src/
│   │   └── index.ts
│   ├── database.sql
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## ✨ Features

✅ **Autenticación & Autorización**
- JWT tokens
- Roles: Owner, Veterinario, Farmacia, Admin
- Password hashing

✅ **Gestión de Mascotas**
- Registro completo (nombre, especie, raza, edad, peso, microchip)
- Historial clínico
- Vacunas y medicamentos

✅ **Teleconsulta**
- Lista de veterinarios disponibles
- Agendamiento de citas
- Video, audio, chat

✅ **Farmacia & PetShop**
- Catálogo de productos
- Carrito de compras
- Gestión de recetas
- Órdenes

✅ **Seguros para Mascotas**
- 3 planes (Básico, Premium, Elite)
- Gestión de pólizas
- Reportes de siniestros

✅ **IA Sentinel**
- Chat inteligente
- Análisis de síntomas
- Recomendaciones

✅ **Panel de Administración**
- Dashboard con KPIs
- Gestión de usuarios
- Reportes

---

## 📦 Módulos

### 🏠 Dashboard
- KPIs en tiempo real
- Resumen de módulos
- Últimas actividades

### 🐾 Mis Mascotas
- Registro de mascotas
- Historial médico
- Próximas vacunas

### 💊 Farmacia
- Búsqueda de productos
- Carrito de compras
- Recetas electrónicas
- Órdenes

### 📹 Teleconsulta
- Directorio de veterinarios
- Agendamiento de citas
- Historial de consultas

### 🛡️ Seguros
- Planes disponibles
- Pólizas activas
- Gestión de siniestros

### 🤖 IA Sentinel
- Asistente clínico
- Análisis de síntomas
- Recomendaciones personalizadas

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login

### Mascotas
- `GET /api/pets` - Listar mis mascotas
- `POST /api/pets` - Crear mascota
- `GET /api/pets/:id` - Detalles de mascota

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products?category=medicine` - Filtrar por categoría
- `GET /api/products/:id` - Detalles de producto

### Veterinarios
- `GET /api/vets` - Listar veterinarios disponibles
- `GET /api/vets/:id` - Detalles de veterinario

### Consultas
- `POST /api/consultations` - Agendar consulta
- `GET /api/consultations` - Mis consultas

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Mis órdenes

### Seguros
- `GET /api/insurance/plans` - Planes disponibles
- `POST /api/insurance/policies` - Contratar plan
- `GET /api/insurance/policies` - Mis pólizas

---

## 💻 Credenciales de Prueba

**Usuario Demo:**
```
Email: demo@lexipet.com
Password: demo123456
Role: owner
```

**Veterinario Demo:**
```
Email: vet@lexipet.com
Password: vet123456
Role: vet
```

---

## 🚀 Deploy

### Frontend - Vercel

```bash
npm install -g vercel
vercel login
cd frontend
vercel
```

### Backend - Railway

```bash
# Conectar repo a Railway
# Configurar variables de entorno en Railway
# Deploy automático desde main
```

Ou **Render:**

```bash
# Conectar repo
# Crear servicio Web
# Configurar DATABASE_URL
# Deploy
```

---

## 🛠️ Tecnología

**Frontend:**
- React 18 + TypeScript
- Vite
- TanStack Query
- Zustand (State Management)
- Axios
- CSS Moderno

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT
- CORS

**Base de Datos:**
- PostgreSQL 12+
- UUID
- JSONB para datos complejos

---

## 📚 Documentación

- [TypeScript Types](frontend/src/types/index.ts)
- [API Routes](backend/src/index.ts)
- [Database Schema](backend/database.sql)

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'pg'"
```bash
cd backend
npm install pg @types/pg
```

### Error: "ECONNREFUSED" en PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres  # Probar conexión
```

### Puerto ya en uso
```bash
# Frontend
npm run dev -- --port 5174

# Backend
PORT=3002 npm run dev
```

---

## 📝 Licencia

Copyright © 2026 LexiPet Network Inc.

---

## 👥 Soporte

Para ayuda, contacta a: support@lexipet.com

✨ **¡Gracias por usar LexiPet Sentinel!** ✨
