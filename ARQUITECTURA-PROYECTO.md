# SPRINT-8 ART GALLERY - ARQUITECTURA COMPLETA

## 📋 Índice
1. [Páginas (Pages)](#páginas-pages)
2. [Componentes Principales](#componentes-principales)
3. [Layout & Navegación](#layout--navegación)
4. [Hooks Personalizados](#hooks-personalizados)
5. [React Query (Queries & Mutations)](#react-query)
6. [API Clients](#api-clients)
7. [Backend (API)](#backend-api)
8. [Flujo de Datos](#flujo-de-datos)
9. [Estadísticas](#estadísticas)

---

## 🌐 CLIENTE (FRONTEND)

### 📱 Páginas (Pages)

#### Páginas Públicas
```
src/pages/
├── PublicHome.tsx          → Página principal pública
├── ShopPage.tsx            → Tienda de obras
├── CartPage.tsx            → Carrito de compras
├── CheckoutPage.tsx        → Proceso de pago
├── ObraDetailPage.tsx      → Detalle de obra
├── MyOrdersPage.tsx        → Mis pedidos (requiere auth)
├── LoginPage.tsx           → Inicio de sesión
└── UnauthorizedPage.tsx    → Página de acceso denegado
```

#### Páginas Admin (Protegidas)
```
src/pages/
└── DashboardPage.tsx       → Dashboard principal
    ├── HomePage (tab: admin)      → Vista general con 3D models + stats
    ├── ObrasPage (tab: obras)     → Gestión de obras
    ├── TiendasPage (tab: tiendas) → Gestión de tiendas
    └── ExposPage (tab: expos)     → Gestión de exposiciones
```

**Protección de rutas:**
- `ProtectedRoute` verifica autenticación con Firebase
- Verifica rol de usuario (admin/user)
- Redirige a `/login` o `/unauthorized` según corresponda

---

## 🧩 COMPONENTES PRINCIPALES

### 📋 HOME/DASHBOARD

```
HomePage.tsx (Dashboard Admin)
│
├──→ Model3DGallery.tsx
│    │
│    └──→ Model3D.tsx (x3 en desktop, x1 en mobile)
│         │
│         └──→ React Three Fiber
│              ├── useGLTF (carga modelos .glb)
│              ├── OrbitControls
│              ├── PerspectiveCamera
│              └── Draco Decoder
│
└──→ Stats Cards (Obras, Tiendas, Exposiciones)
     └──→ shadcn/ui Card components
```

**Características:**
- **Desktop**: 3 modelos 3D en grid horizontal
- **Mobile**: Solo 1 modelo (performance)
- **Modelos desde Cloudinary** (comprimidos con Draco)
- **Stats clickeables** para navegar a secciones

---

### 📦 OBRAS (Artwork Management)

```
ObrasPage.tsx
│
├──→ MOBILE (< lg)
│    └──→ Accordion (shadcn/ui)
│         ├── AccordionItem: "Subir piedra"
│         │   └──→ ObraFormCreate
│         └── AccordionItem: "Inventario"
│             ├──→ Search Input
│             ├──→ ObrasTable
│             └──→ Pagination
│
├──→ DESKTOP (≥ lg)
│    ├──→ Grid [1fr_2fr]
│    │    ├── Column 1: ObraFormCreate
│    │    └── Column 2: ObrasTable + Search + Pagination
│    │
│    └──→ Grid [1fr_2fr] (Charts)
│         ├── Espacio vacío
│         └── [ObrasUbicacionChart | ObrasVentasChart | LocationsMap]
│
└──→ ObraEditModal (compartido)
     ├──→ Edit form
     ├──→ Image gallery (multiple upload)
     └──→ Email notification (EmailJS)
```

**Hooks utilizados:**
- `useObraSort` - Ordenamiento y paginación
- `useObraSearch` - Búsqueda en tiempo real
- `useObraEdit` - Estado de edición
- `useObraImages` - Gestión de imágenes múltiples

**Charts:**
- `ObrasUbicacionChart` - Distribución por ubicación (Recharts)
- `ObrasVentasChart` - Ventas y entregas por mes (Recharts)
- `LocationsMap` - Mapa con Leaflet

---

### 🏪 TIENDAS + 🎨 EXPOSICIONES

```
TiendasPage.tsx                    ExposPage.tsx
│                                  │
├──→ Model3D (Balancing Act)       ├──→ Model3D (Pebble Art)
│                                  │
├──→ LocationForm                  ├──→ LocationForm
│    (nombre, lat, lng, url)       │    + DatePicker (inicio/fin)
│                                  │
├──→ LocationTable                 ├──→ LocationTable
│                                  │
└──→ LocationEditModal             └──→ LocationEditModal
                                        + DatePicker
```

**Componentes compartidos:**
- `LocationForm` - Formulario genérico para tiendas/expos
- `LocationTable` - Tabla genérica con acciones
- `LocationEditModal` - Modal de edición genérico

**Personalización por tipo:**
- TiendasPage: Solo campos básicos
- ExposPage: Agrega DatePickers para fechas

---

### 🛒 CHECKOUT FLOW

```
CheckoutPage.tsx
│
├──→ ShippingForm.tsx
│    ├──→ useFormValidation (hook)
│    │    ├── validateEmail
│    │    ├── validateTelefono (10 dígitos)
│    │    ├── validateCodigoPostal (5 dígitos)
│    │    ├── validateNombre (min 3 chars)
│    │    └── validateDireccion (min 5 chars)
│    │
│    └──→ Campos:
│         ├── email
│         ├── nombre
│         ├── telefono
│         ├── direccion
│         ├── numeroExterior
│         ├── numeroInterior (opcional)
│         ├── colonia
│         ├── codigoPostal
│         ├── ciudad
│         ├── estado (dropdown)
│         ├── pais (locked: "México")
│         └── referencias (opcional)
│
├──→ PaymentForm.tsx
│    ├──→ Stripe CardElement
│    ├──→ Visual feedback (green/red border)
│    ├──→ Card brand detection
│    └──→ useStripePayment (hook)
│
├──→ OrderSummary.tsx
│    └──→ Resumen de items y totales
│
└──→ OrderSuccess.tsx
     └──→ Confirmación de pedido
```

**Validaciones:**
- Real-time validation on blur
- Re-validation on change if error exists
- Visual feedback (red border + error message)

---

## 🎨 LAYOUT & NAVEGACIÓN

### Public Layout

```
PillNav.tsx (Public Navigation)
├──→ Navigation Pills
│    ├── Inicio
│    ├── Tienda
│    └── Mis Compras (solo si autenticado)
│
├──→ Cart Button (con badge de cantidad)
├──→ Admin Button (solo visible para role: admin)
├──→ Theme Toggle (light/dark)
└──→ Auth Section (Login/Logout + User info)

PublicLayout.tsx
├──→ LiquidEther (Background animado)
├──→ LogoLoop (SVG animado en esquina)
├──→ PillNav
└──→ {children} (contenido)
```

**Características:**
- **Pill Navigation animado** con indicador deslizante
- **Responsive**: Desktop (full) / Mobile (compacto)
- **Background interactivo** con efectos fluidos

---

### Admin Layout

```
AdminNav.tsx
├──→ Logo (piedra-arte-03.svg)
│    ├── h-32 (grande)
│    └── ml-16 (desplazado a derecha)
│
├──→ Pill Navigation (centro)
│    ├── Dashboard
│    ├── Obras
│    ├── Tiendas
│    └── Exposiciones
│
└──→ Right Actions
     ├── Home Button (volver a público)
     ├── Theme Toggle
     ├── User Info (nombre + role badge)
     └── Logout Button
```

**Responsive:**
- Desktop: Logo grande + nav completa + info usuario
- Mobile: Logo + nav compacta + iconos

---

## 🪝 HOOKS PERSONALIZADOS

### Data & State Management

```typescript
// Obras
useObraSort()         → Ordenamiento, paginación (page, pageSize)
useObraSearch()       → Filtrado en tiempo real
useObraEdit()         → Estado de edición (edit state)
useObraImages()       → Gestión de múltiples imágenes
useObraForm()         → Estado de formulario de obras
useIsInCart()         → Verifica si obra está en carrito

// Checkout
useCheckoutForm()     → Estado de formulario de checkout
useFormValidation()   → Validaciones (email, teléfono, CP, etc)
useStripePayment()    → Integración con Stripe

// Tests
useFormValidation.test.ts → 31 tests (AAA pattern)
```

### Ejemplo: useFormValidation

```typescript
export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): string => {
    if (!email) return "El email es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email inválido";
    return "";
  };

  const validateTelefono = (telefono: string): string => {
    if (!telefono) return "El teléfono es requerido";
    const cleanPhone = telefono.replace(/\s/g, "");
    if (!/^\d{10}$/.test(cleanPhone))
      return "El teléfono debe tener 10 dígitos";
    return "";
  };

  // ... más validadores
}
```

---

## 📡 REACT QUERY (Queries & Mutations)

### Estructura

```
src/query/
├── obras.ts
│   ├── useObras(params)          → GET /api/obras (paginated + sorted)
│   ├── useCreateObra()           → POST /api/obras
│   ├── useUpdateObra()           → PUT /api/obras/:id
│   └── useRemoveObra()           → DELETE /api/obras/:id
│
├── tiendas.ts
│   ├── useTiendas()              → GET /api/tiendas
│   ├── useCreateTienda()         → POST /api/tiendas
│   ├── useUpdateTienda()         → PUT /api/tiendas/:id
│   └── useRemoveTienda()         → DELETE /api/tiendas/:id
│
├── expos.ts
│   ├── useExpos()                → GET /api/expos
│   ├── useCreateExpo()           → POST /api/expos
│   ├── useUpdateExpo()           → PUT /api/expos/:id
│   └── useRemoveExpo()           → DELETE /api/expos/:id
│
├── images.ts
│   ├── useObraImages(obraId)     → GET /api/images/:obraId
│   ├── useUploadImage()          → POST /api/images (multipart)
│   └── useDeleteImage()          → DELETE /api/images/:id
│
└── orders.ts
    ├── useUserOrders()           → GET /api/orders/user
    └── useCreateOrder()          → POST /api/orders
```

### Ejemplo: useObras

```typescript
export function useObras(params: {
  sort: { key: string; dir: "asc" | "desc" };
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ["obras", params],
    queryFn: async () => {
      const res = await obrasService.getAllObras(params);
      return res.data;
    },
  });
}
```

**Características:**
- **Cache automático** por queryKey
- **Invalidación optimista** en mutaciones
- **Retry automático** en errores
- **Loading y error states** manejados

---

## 🔌 API CLIENTS

```
src/api/
├── client.ts                     (Public API)
│   └── axios.create({
│        baseURL: import.meta.env.VITE_API_URL,
│        headers: { 'Content-Type': 'application/json' }
│      })
│
└── clientWithAuth.ts             (Admin API)
    └── axios.create({
         baseURL: import.meta.env.VITE_API_URL,
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         }
       })
       + Interceptor para refrescar token
```

**Interceptors:**
- Request: Agrega Firebase Auth token
- Response: Maneja errores 401/403
- Retry logic para token expirado

---

## ⚙️ BACKEND (API)

### Server & Routing

```
api/src/server.ts (Express)

Middleware Stack:
├── cors()                        → CORS headers
├── express.json()                → JSON parsing
├── authMiddleware                → Firebase Auth verification
└── errorHandler                  → Centralized error handling

Routes:
├── /api/health                   → Health check
├── /api/obras                    → CRUD obras
├── /api/tiendas                  → CRUD tiendas
├── /api/expos                    → CRUD exposiciones
├── /api/images                   → Upload/Delete images
├── /api/orders                   → Crear/Listar pedidos
└── /api/payments                 → Stripe integration
```

### Controllers

```
api/src/controllers/

obrasController.ts
├── list(req, res)                → GET /api/obras
├── get(req, res)                 → GET /api/obras/:id
├── create(req, res)              → POST /api/obras
├── update(req, res)              → PUT /api/obras/:id
└── remove(req, res)              → DELETE /api/obras/:id

tiendasController.ts              (same pattern)
exposController.ts                (same pattern)

imagesController.ts
├── getByObra(req, res)           → GET /api/images/:obraId
├── upload(req, res)              → POST /api/images
│   └── Uses multer + Cloudinary
└── remove(req, res)              → DELETE /api/images/:id

ordersController.ts
├── getUserOrders(req, res)       → GET /api/orders/user
├── create(req, res)              → POST /api/orders
└── updateStatus(req, res)        → PUT /api/orders/:id/status

paymentsController.ts
├── createIntent(req, res)        → POST /api/payments/intent
└── confirmPayment(req, res)      → POST /api/payments/confirm
```

### Services (Business Logic)

```
api/src/services/

obrasService.ts
├── getAllObras(params)           → Lógica de paginación + sort
├── getObraById(id)               → Validación de ID
├── createObra(data)              → Validación de datos
├── updateObra(id, data)          → Validación + actualización
└── deleteObra(id)                → Soft delete o hard delete

imagesService.ts
├── getImagesByObra(obraId)
├── uploadImage(file, obraId)
│   ├── Valida formato (jpg, png, webp)
│   ├── Valida tamaño (< 5MB)
│   └── Upload a Cloudinary
└── deleteImage(id)
    └── Delete de Cloudinary + DB

ordersService.ts
├── getOrdersByUser(userId)
├── createOrder(data)
│   ├── Valida stock
│   ├── Calcula totales
│   ├── Crea orden en DB
│   └── Envía email de confirmación
└── updateOrderStatus(id, status)
    └── EmailJS notification
```

### Repositories (Data Access)

```
api/src/repositories/

obrasRepo.ts
├── findAll(params)               → SELECT con paginación
├── findById(id)                  → SELECT WHERE id = ?
├── create(data)                  → INSERT INTO
├── update(id, data)              → UPDATE SET WHERE id = ?
├── delete(id)                    → DELETE WHERE id = ?
└── count()                       → SELECT COUNT(*)

imagesRepo.ts
├── findByObraId(obraId)          → SELECT WHERE obra_id = ?
├── create(data)                  → INSERT INTO imagenes
└── delete(id)                    → DELETE WHERE id = ?

ordersRepo.ts
├── findByUserId(userId)          → SELECT con JOIN
├── create(data)                  → INSERT orden + items
└── update(id, status)            → UPDATE status
```

**PostgreSQL Pool:**
```typescript
// api/src/db/pool.ts
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});
```

---

## 💾 DATABASE (PostgreSQL)

### Esquema de Tablas

```sql
-- Obras (Artworks)
CREATE TABLE obras (
  id_obra SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  tecnica VARCHAR(100),
  anio INTEGER,
  precio DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  estado_venta VARCHAR(50) DEFAULT 'disponible',
  id_tienda INTEGER REFERENCES tiendas(id_tienda),
  id_expo INTEGER REFERENCES expos(id_expo),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tiendas (Stores)
CREATE TABLE tiendas (
  id_tienda SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  url_tienda VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exposiciones (Exhibitions)
CREATE TABLE expos (
  id_expo SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  url_expo VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Imágenes (Images)
CREATE TABLE imagenes (
  id_imagen SERIAL PRIMARY KEY,
  id_obra INTEGER REFERENCES obras(id_obra) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  public_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Órdenes (Orders)
CREATE TABLE ordenes (
  id_orden SERIAL PRIMARY KEY,
  id_user VARCHAR(255) NOT NULL,
  obras JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping JSONB NOT NULL,
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Índices

```sql
CREATE INDEX idx_obras_estado ON obras(estado_venta);
CREATE INDEX idx_obras_tienda ON obras(id_tienda);
CREATE INDEX idx_obras_expo ON obras(id_expo);
CREATE INDEX idx_imagenes_obra ON imagenes(id_obra);
CREATE INDEX idx_ordenes_user ON ordenes(id_user);
```

---

## 🔐 AUTENTICACIÓN & SERVICIOS EXTERNOS

### Firebase Auth

**Frontend:**
```typescript
// src/context/AuthContextFirebase.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const userDoc = await getUserFromDB(firebaseUser.uid);
        setUser({ ...firebaseUser, ...userDoc, token });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);
}
```

**Backend:**
```typescript
// api/src/middleware/authMiddleware.ts
export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Stripe Payments

```typescript
// Frontend: src/hooks/useStripePayment.ts
export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();

  const processPayment = async (amount: number) => {
    // 1. Create payment intent
    const { clientSecret } = await paymentsAPI.createIntent(amount);

    // 2. Confirm card payment
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) throw error;
  };
}

// Backend: api/src/controllers/paymentsController.ts
export async function createIntent(req, res) {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: 'mxn',
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}
```

### Cloudinary (Images)

```typescript
// api/src/services/imagesService.ts
export async function uploadToCloudinary(file: Express.Multer.File) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'art-gallery',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });

  return {
    url: result.secure_url,
    public_id: result.public_id
  };
}
```

### EmailJS (Notifications)

```typescript
// src/components/Obras/ObraEditModal.tsx
const sendDeliveryEmail = async () => {
  await emailjs.send(
    'service_id',
    'template_id',
    {
      to_email: customerEmail,
      obra_title: obra.titulo,
      tracking_number: trackingNumber
    },
    'public_key'
  );
};
```

---

## 🎯 FLUJO DE DATOS PRINCIPAL

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER ACTION (Click, Submit, etc.)                    │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 2. COMPONENT (React)                                    │
│    - Maneja evento                                      │
│    - Llama a custom hook o mutation                     │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CUSTOM HOOK / REACT QUERY                            │
│    - useObras, useCreateObra, etc.                      │
│    - Gestiona estado de loading/error                   │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 4. API CLIENT (axios)                                   │
│    - Agrega Firebase Auth token                         │
│    - Serializa datos                                    │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 5. HTTP REQUEST                                         │
│    GET /api/obras?page=1&sort=titulo&dir=asc           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
        ═════════════════════════════════════
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 6. EXPRESS SERVER (api/src/server.ts)                  │
│    - Recibe request                                     │
│    - Ejecuta middleware stack                           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 7. AUTH MIDDLEWARE                                      │
│    - Verifica Firebase token                            │
│    - Agrega req.user                                    │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 8. CONTROLLER (obrasController.ts)                     │
│    - Valida request params                              │
│    - Llama a service layer                              │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 9. SERVICE (obrasService.ts)                           │
│    - Business logic                                     │
│    - Validaciones complejas                             │
│    - Llama a repository                                 │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 10. REPOSITORY (obrasRepo.ts)                          │
│     - SQL queries                                       │
│     - Data mapping                                      │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 11. POSTGRESQL DATABASE                                │
│     - Ejecuta query                                     │
│     - Retorna resultados                                │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 12. RESPONSE DATA                                       │
│     - Repository → Service → Controller                 │
│     - Format response JSON                              │
└──────────────────────┬──────────────────────────────────┘
                       ↓
        ═════════════════════════════════════
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 13. HTTP RESPONSE                                       │
│     { data: [...], total: 50 }                          │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 14. REACT QUERY CACHE UPDATE                           │
│     - Actualiza cache automáticamente                   │
│     - Invalida queries relacionadas                     │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 15. COMPONENT RE-RENDER                                │
│     - Nuevos datos disponibles                          │
│     - UI se actualiza automáticamente                   │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ 16. UPDATED UI                                          │
│     - Usuario ve cambios                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO

### Frontend (src/)
```
📁 Estructura:
├── 105 archivos TypeScript/TSX
├── 15 Páginas
├── 50+ Componentes
├── 10 Custom Hooks
├── 5 React Query files
├── 12 Componentes UI (shadcn/ui)
└── 31 Tests (useFormValidation)

📦 Componentes por categoría:
├── Pages (8 públicas + 7 admin)
├── 3D (Model3D, Model3DGallery)
├── Obras (6 componentes)
├── Checkout (4 componentes)
├── Layout (5 componentes)
├── Shared (3 componentes)
└── UI (12 componentes shadcn)
```

### Backend (api/src/)
```
📁 Arquitectura en capas:
├── 6 Controllers
├── 5 Services
├── 5 Repositories
├── 3 Middleware
├── 4 Rutas principales
└── 3 Config files

🔄 Patrones:
├── Repository Pattern
├── Service Layer
├── Dependency Injection
└── Error Handling centralizado
```

### Tecnologías Clave

**Frontend:**
- React 19 + TypeScript
- React Three Fiber (3D models)
- TanStack Query (React Query v5)
- Tailwind CSS 4 + shadcn/ui
- Framer Motion (animations)
- React Router v7
- Recharts (charts)
- Leaflet (maps)

**Backend:**
- Express.js
- PostgreSQL (pg)
- Firebase Admin SDK
- Multer (file uploads)
- Stripe (payments)

**Servicios Externos:**
- Firebase Auth
- Cloudinary (CDN)
- Stripe Payments
- EmailJS

---

## ✅ PATRONES Y PRINCIPIOS APLICADOS

### SOLID Principles

**S - Single Responsibility Principle:**
- ✅ Cada componente tiene una responsabilidad única
- ✅ Separación Controller → Service → Repository

**O - Open/Closed Principle:**
- ✅ Componentes extensibles via props
- ✅ LocationForm/Table reutilizables con props genéricos

**L - Liskov Substitution Principle:**
- ✅ Componentes intercambiables cuando implementan misma interfaz

**I - Interface Segregation Principle:**
- ✅ Interfaces específicas por componente
- ✅ No se fuerzan props innecesarias

**D - Dependency Inversion Principle:**
- ✅ Hooks como abstracciones de lógica
- ✅ Services dependen de interfaces, no implementaciones

### DRY (Don't Repeat Yourself)

- ✅ LocationForm compartido entre Tiendas/Expos
- ✅ Model3D reutilizable en múltiples contextos
- ✅ Custom hooks para lógica repetitiva
- ✅ Componentes UI de shadcn/ui

### KISS (Keep It Simple, Stupid)

- ✅ Props claras y directas
- ✅ Lógica simple en componentes
- ✅ Hooks especializados para complejidad

### Clean Architecture

```
Presentation Layer (Components)
      ↓
Business Logic (Hooks + Services)
      ↓
Data Access (Repositories)
      ↓
Database (PostgreSQL)
```

### Otros Patrones

- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic isolation
- **Custom Hooks** - Reusable stateful logic
- **Context API** - Global state (Auth, Cart)
- **Component Composition** - Reutilización
- **Container/Presentational** - Separación de concerns

---

## 🎨 CARACTERÍSTICAS DESTACADAS

### 3D Models Integration
- React Three Fiber para renderizado 3D
- Modelos comprimidos con Draco (< 10MB)
- CDN delivery via Cloudinary
- Auto-rotación configurable
- Responsive (1 modelo mobile, 3 desktop)

### Responsive Design
- Mobile-first approach
- Accordion colapsable en móvil
- Pill navigation adaptativa
- Charts responsivos

### Performance
- React Query cache inteligente
- Lazy loading de componentes
- Image optimization (Cloudinary)
- Paginación server-side

### UX Features
- Real-time search
- Optimistic updates
- Loading states
- Error handling visual
- Toast notifications

### Security
- Firebase Auth con JWT
- Protected routes
- Role-based access (admin/user)
- CSRF protection
- Input validation (frontend + backend)

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Mejores Prácticas Aplicadas

1. **TypeScript estricto** en todo el proyecto
2. **Error boundaries** para errores de React
3. **Validación doble** (cliente + servidor)
4. **Manejo centralizado de errores** en backend
5. **Tests unitarios** para lógica crítica
6. **Git workflow** con feature branches
7. **Environment variables** para configuración
8. **Code splitting** para performance
9. **Accessibility** (ARIA labels, semantic HTML)
10. **Documentation** inline y README

### Convenciones de Código

```typescript
// Naming conventions
- Components: PascalCase (HomePage.tsx)
- Hooks: camelCase con 'use' prefix (useObras.ts)
- Utils: camelCase (formatters.ts)
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

// File structure
- One component per file
- Co-located styles (Tailwind classes)
- Types near usage
- Tests alongside code

// Import order
1. React & dependencies
2. Components
3. Hooks
4. Utils & helpers
5. Types
6. Styles
```

---

## 🚀 DEPLOYMENT

### Frontend (Vercel)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Backend (Vercel Functions)
```bash
# Build
cd api && npm run build

# Deploy
vercel --prod
```

### Database (PostgreSQL)
- Hosted on Vercel Postgres / Railway / Supabase
- Migrations via SQL scripts
- Connection pooling enabled

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### Documentación Oficial
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Firebase](https://firebase.google.com/docs)
- [Stripe](https://stripe.com/docs)

### Herramientas
- Vite (build tool)
- ESLint (linting)
- Prettier (formatting)
- Vitest (testing)

---

**Generado el:** 2025-10-20
**Versión del proyecto:** Sprint 8
**Arquitectura diseñada por:** Claude (Anthropic)

---

*Este documento describe la arquitectura completa del proyecto Spring-8 Art Gallery, incluyendo frontend (React), backend (Express), database (PostgreSQL) y servicios externos (Firebase, Stripe, Cloudinary).*
