# 🎨 Piedra Art Gallery

> Galería de arte digital con e-commerce integrado, administración de obras y modelos 3D interactivos.

## 🌐 Demo en Vivo

<p align="center">
  <a href="https://your-vercel-deployment.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Ver_Demo-Live-success?style=for-the-badge&logo=vercel&logoColor=white" alt="Ver Demo" />
  </a>
  <a href="https://your-api-deployment.vercel.app/api/health" target="_blank">
    <img src="https://img.shields.io/badge/API-Online-blue?style=for-the-badge&logo=vercel&logoColor=white" alt="API Status" />
  </a>
</p>

> **Nota:** Reemplaza las URLs arriba con tu deployment real de Vercel

---

## 🚀 Tech Stack

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.13-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.23-FF0080?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Three.js-0.180-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/React_Query-5.90-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/React_Router-7.9-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

### Services & Tools
<p align="left">
  <img src="https://img.shields.io/badge/Firebase-12.4-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Stripe-19.1-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Cloudinary-2.7-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Recharts-2.15-8884D8?style=for-the-badge" alt="Recharts" />
  <img src="https://img.shields.io/badge/Vitest-3.2-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>

---

## ✨ Features

- 🎨 **Galería de Arte** - Visualización de obras con imágenes optimizadas
- 🛒 **E-commerce** - Carrito de compras y checkout con Stripe
- 🔐 **Autenticación** - Firebase Auth con roles (admin/user)
- 📊 **Dashboard Admin** - Gestión completa de obras, tiendas y exposiciones
- 🗺️ **Mapas Interactivos** - Ubicación de tiendas y exposiciones con Leaflet
- 📈 **Analytics** - Gráficos de ventas y ubicaciones con Recharts
- 🎭 **Modelos 3D** - Visualización interactiva con Three.js
- 📱 **Responsive Design** - Optimizado para mobile y desktop
- 🌙 **Dark Mode** - Tema claro y oscuro
- ⚡ **Performance** - CDN, lazy loading, code splitting

---

## 📋 Requisitos Previos

- **Node.js** 20.x o superior
- **npm** 10.x o superior
- **MySQL** 8.0 o superior
- **Git**

---

## 🛠️ Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Sprint-8-art-gallery
```

### 2. Instalar dependencias

Ejecuta el script de instalación automática:

```bash
# En la raíz del proyecto
npm run install-all
```

O manualmente:

```bash
# Frontend
npm install

# Backend
cd api
npm install
cd ..
```

### 3. Configurar variables de entorno

#### Frontend (`.env`)

Crea un archivo `.env` en la raíz del proyecto:

```env
# API URL
VITE_API_URL=http://localhost:3000

# Firebase Config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Public Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Backend (`api/.env`)

Crea un archivo `.env` en la carpeta `api`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=art_gallery
DB_USER=root
DB_PASSWORD=your_password

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your_project.iam.gserviceaccount.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Configurar la base de datos

```bash
# Conectarse a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE art_gallery;
USE art_gallery;

# Ejecutar el schema
source api/schema.sql
```

O usando el script:

```bash
cd api
mysql -u root -p art_gallery < schema.sql
cd ..
```

### 5. Iniciar el proyecto

```bash
# Modo desarrollo (frontend + backend)
npm run dev

# O por separado:

# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd api
npm run dev
```

---

## 📦 Scripts Disponibles

### Frontend

```bash
npm run dev          # Inicia servidor de desarrollo (Vite)
npm run build        # Construye para producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecuta ESLint
npm run test         # Ejecuta tests con Vitest
npm run test:ui      # Ejecuta tests con UI
npm run test:coverage # Genera reporte de cobertura
```

### Backend

```bash
npm run dev          # Inicia servidor con ts-node
npm run build        # Compila TypeScript a JavaScript
npm run start        # Inicia servidor en producción
npm run test         # Ejecuta tests
npm run test:watch   # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de cobertura
```

---

## 🗂️ Estructura del Proyecto

```
Sprint-8-art-gallery/
├── src/                      # Frontend source
│   ├── components/           # Componentes React
│   │   ├── Home/            # Componentes de la home
│   │   ├── Obras/           # Gestión de obras
│   │   ├── Checkout/        # Flujo de pago
│   │   ├── layout/          # Layout components
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Páginas/Rutas
│   ├── hooks/               # Custom hooks
│   ├── context/             # React Context (Auth, Cart)
│   ├── query/               # React Query (API calls)
│   ├── api/                 # API clients (axios)
│   ├── lib/                 # Utils y helpers
│   └── types/               # TypeScript types
├── api/                     # Backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Entry point
│   ├── schema.sql          # Database schema
│   └── package.json
├── public/                  # Static assets
├── ARQUITECTURA-PROYECTO.md # Documentación completa
├── DIAGRAMA-ARQUITECTURA.md # Diagramas visuales
└── package.json
```

---

## 🌐 Endpoints API

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/obras` - Listar obras disponibles
- `GET /api/obras/:id` - Detalle de obra
- `GET /api/tiendas` - Listar tiendas
- `GET /api/expos` - Listar exposiciones

### Protected Endpoints (Require Auth)

**Obras**
- `POST /api/obras` - Crear obra
- `PUT /api/obras/:id` - Actualizar obra
- `DELETE /api/obras/:id` - Eliminar obra

**Images**
- `GET /api/images/:obraId` - Obtener imágenes de obra
- `POST /api/images` - Subir imagen
- `DELETE /api/images/:id` - Eliminar imagen

**Orders**
- `GET /api/orders/user` - Obtener órdenes del usuario
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id/status` - Actualizar status

**Payments**
- `POST /api/payments/intent` - Crear payment intent (Stripe)
- `POST /api/payments/confirm` - Confirmar pago

---

## 🔐 Roles de Usuario

### User (Cliente)
- Ver galería de obras
- Comprar obras
- Ver mis pedidos
- Gestionar carrito

### Admin
- Todo lo anterior +
- Crear/Editar/Eliminar obras
- Gestionar tiendas
- Gestionar exposiciones
- Ver estadísticas y analytics
- Visualizar modelos 3D
- Enviar notificaciones de envío

---

## 🧪 Testing

```bash
# Frontend
npm run test              # Ejecutar tests
npm run test:ui           # UI de Vitest
npm run test:coverage     # Cobertura de código

# Backend
cd api
npm run test              # Ejecutar tests
npm run test:coverage     # Cobertura de código
```

---

## 📚 Documentación Adicional

- [ARQUITECTURA-PROYECTO.md](./ARQUITECTURA-PROYECTO.md) - Documentación técnica completa
- [DIAGRAMA-ARQUITECTURA.md](./DIAGRAMA-ARQUITECTURA.md) - Diagramas de arquitectura y flujos

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Backend (Vercel/Railway)

```bash
cd api
npm run build
# Deploy según plataforma
```

### Database

Opciones recomendadas:
- [Railway](https://railway.app/) - MySQL hosting
- [PlanetScale](https://planetscale.com/) - MySQL serverless
- [AWS RDS](https://aws.amazon.com/rds/) - MySQL managed

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es parte del Sprint  9 IT Academy Barcelona  .

---

## 👥 Autor

Desarrollado por **Ricardo bauve** - [IT ACADEMY](https://www.barcelonactiva.cat/es/itacademy)

---

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) - Sistema de componentes
- [Firebase](https://firebase.google.com/) - Autenticación
- [Stripe](https://stripe.com/) - Procesamiento de pagos
- [Cloudinary](https://cloudinary.com/) - CDN de imágenes
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Renderizado 3D
- [Manuela Grajales](https://www.linkedin.com/in/mgduque/) - Mentora Semior developer IT ACADEMY

