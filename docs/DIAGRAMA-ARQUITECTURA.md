# DIAGRAMA DE ARQUITECTURA - ART GALLERY APP

## 📊 DIAGRAMA GENERAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USUARIO FINAL                                     │
│                    (Browser: Chrome, Safari, etc.)                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 19 + Vite)                          │
│                         Port: 5173 (dev) / Vercel (prod)                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PUBLIC ROUTES (/)                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ PublicHome   │  │  ShopPage    │  │  CartPage    │              │   │
│  │  │   (/)        │  │  (/shop)     │  │  (/cart)     │              │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                 │                 │                       │   │
│  │         └─────────────────┼─────────────────┘                       │   │
│  │                           ▼                                         │   │
│  │              ┌────────────────────────┐                             │   │
│  │              │   PUBLIC COMPONENTS    │                             │   │
│  │              ├────────────────────────┤                             │   │
│  │              │ • HeroSection          │                             │   │
│  │              │ • WelcomeSection       │                             │   │
│  │              │ • GallerySection       │                             │   │
│  │              │ • ObraCard             │                             │   │
│  │              │ • PillNav              │                             │   │
│  │              │ • LogoLoop             │                             │   │
│  │              │ • LiquidEther          │                             │   │
│  │              └────────────────────────┘                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PROTECTED ROUTES (/dashboard)                    │   │
│  │              [Requires Firebase Auth + Role: admin]                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  HomePage    │  │  ObrasPage   │  │ TiendasPage  │              │   │
│  │  │ (dashboard)  │  │   (obras)    │  │  (tiendas)   │              │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                 │                 │                       │   │
│  │         │                 │                 │                       │   │
│  │  ┌──────┴──────────────────┴─────────────────┴────────┐            │   │
│  │  │           ADMIN COMPONENTS                          │            │   │
│  │  ├─────────────────────────────────────────────────────┤            │   │
│  │  │ • Model3DGallery (3 models desktop, 1 mobile)       │            │   │
│  │  │ • ObraFormCreate / ObraEditModal                    │            │   │
│  │  │ • ObrasTable + Search + Pagination                  │            │   │
│  │  │ • LocationForm / LocationTable                      │            │   │
│  │  │ • Charts (Recharts): Ubicacion, Ventas             │            │   │
│  │  │ • LocationsMap (Leaflet)                            │            │   │
│  │  │ • AdminNav                                          │            │   │
│  │  └─────────────────────────────────────────────────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CHECKOUT FLOW (/checkout)                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ShippingForm  │→ │ PaymentForm  │→ │OrderSuccess  │              │   │
│  │  │(Validation)  │  │  (Stripe)    │  │ (Confirm)    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    STATE MANAGEMENT LAYER                           │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  REACT QUERY (TanStack Query v5)                             │   │   │
│  │  │  • Cache management                                          │   │   │
│  │  │  • Automatic refetching                                      │   │   │
│  │  │  • Optimistic updates                                        │   │   │
│  │  │  • Invalidation on mutations                                 │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  CONTEXT API                                                 │   │   │
│  │  │  • AuthContextFirebase (user, login, logout)                 │   │   │
│  │  │  • CartContext (items, add, remove, clear)                   │   │   │
│  │  │  • ThemeContext (dark/light mode)                            │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  CUSTOM HOOKS (16 hooks)                                     │   │   │
│  │  │  • useObraSort, useObraSearch, useObraEdit                   │   │   │
│  │  │  • useFormValidation, useCheckoutForm                        │   │   │
│  │  │  • useStripePayment, useIsInCart                             │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    API CLIENT LAYER                                 │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  client.ts (Public API)                                      │   │   │
│  │  │  • baseURL: VITE_API_URL                                     │   │   │
│  │  │  • No auth required                                          │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  clientWithAuth.ts (Admin API)                               │   │   │
│  │  │  • baseURL: VITE_API_URL                                     │   │   │
│  │  │  • Authorization: Bearer {Firebase Token}                    │   │   │
│  │  │  • Token refresh interceptor                                 │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ HTTP/HTTPS
                                 │ (REST API Calls)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API (Express.js)                            │
│                         Port: 3000 / Vercel Functions                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MIDDLEWARE STACK                               │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  1. CORS Middleware                                          │   │   │
│  │  │     • Allow: frontend origins                                │   │   │
│  │  │     • Methods: GET, POST, PUT, DELETE                        │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  2. express.json()                                           │   │   │
│  │  │     • Parse JSON body                                        │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  3. authMiddleware (Protected routes only)                   │   │   │
│  │  │     • Verify Firebase ID Token                               │   │   │
│  │  │     • Extract user info → req.user                           │   │   │
│  │  │     • Check role permissions                                 │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  4. Error Handler                                            │   │   │
│  │  │     • Catch all errors                                       │   │   │
│  │  │     • Format error response                                  │   │   │
│  │  │     • Log errors                                             │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ROUTES & CONTROLLERS                           │   │
│  │                                                                     │   │
│  │  /api/health                                                        │   │
│  │  └──→ healthController.check()                                      │   │
│  │                                                                     │   │
│  │  /api/obras                              [Auth Required]            │   │
│  │  ├──→ GET    /                → obrasController.list()              │   │
│  │  ├──→ GET    /:id             → obrasController.get()               │   │
│  │  ├──→ POST   /                → obrasController.create()            │   │
│  │  ├──→ PUT    /:id             → obrasController.update()            │   │
│  │  └──→ DELETE /:id             → obrasController.remove()            │   │
│  │                                                                     │   │
│  │  /api/tiendas                            [Auth Required]            │   │
│  │  ├──→ GET    /                → tiendasController.list()            │   │
│  │  ├──→ POST   /                → tiendasController.create()          │   │
│  │  ├──→ PUT    /:id             → tiendasController.update()          │   │
│  │  └──→ DELETE /:id             → tiendasController.remove()          │   │
│  │                                                                     │   │
│  │  /api/expos                              [Auth Required]            │   │
│  │  ├──→ GET    /                → exposController.list()              │   │
│  │  ├──→ POST   /                → exposController.create()            │   │
│  │  ├──→ PUT    /:id             → exposController.update()            │   │
│  │  └──→ DELETE /:id             → exposController.remove()            │   │
│  │                                                                     │   │
│  │  /api/images                             [Auth Required]            │   │
│  │  ├──→ GET    /:obraId         → imagesController.getByObra()        │   │
│  │  ├──→ POST   /                → imagesController.upload()           │   │
│  │  │              (multipart/form-data + multer)                      │   │
│  │  └──→ DELETE /:id             → imagesController.remove()           │   │
│  │                                                                     │   │
│  │  /api/orders                             [Auth Required]            │   │
│  │  ├──→ GET    /user            → ordersController.getUserOrders()    │   │
│  │  ├──→ POST   /                → ordersController.create()           │   │
│  │  └──→ PUT    /:id/status      → ordersController.updateStatus()     │   │
│  │                                                                     │   │
│  │  /api/payments                           [Auth Required]            │   │
│  │  ├──→ POST   /intent          → paymentsController.createIntent()   │   │
│  │  └──→ POST   /confirm         → paymentsController.confirmPayment() │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SERVICE LAYER                                  │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  obrasService.ts                                             │   │   │
│  │  │  • Business logic for obras                                  │   │   │
│  │  │  • Validation rules                                          │   │   │
│  │  │  • Data transformation                                       │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  imagesService.ts                                            │   │   │
│  │  │  • Image upload logic                                        │   │   │
│  │  │  • Cloudinary integration                                    │   │   │
│  │  │  • File validation (size, format)                            │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  ordersService.ts                                            │   │   │
│  │  │  • Order creation logic                                      │   │   │
│  │  │  • Stock validation                                          │   │   │
│  │  │  • Email notifications (EmailJS)                             │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  paymentsService.ts                                          │   │   │
│  │  │  • Stripe integration                                        │   │   │
│  │  │  • Payment intent creation                                   │   │   │
│  │  │  • Payment confirmation                                      │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    REPOSITORY LAYER (Data Access)                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  obrasRepo.ts                                                │   │   │
│  │  │  • SQL queries for obras table                               │   │   │
│  │  │  • CRUD operations                                           │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  tiendasRepo.ts / exposRepo.ts                               │   │   │
│  │  │  • SQL queries for locations                                 │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  imagesRepo.ts                                               │   │   │
│  │  │  • SQL queries for imagenes table                            │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  ordersRepo.ts                                               │   │   │
│  │  │  • SQL queries for ordenes table                             │   │   │
│  │  │  • JOIN operations with obras                                │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL/MySQL)                         │
│                         Hosted: Vercel/Railway/Supabase                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TABLES                                                             │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  obras                                                     │    │   │
│  │  │  • id_obra (PK)                                            │    │   │
│  │  │  • titulo, autor, tecnica, anio                            │    │   │
│  │  │  • precio, descripcion                                     │    │   │
│  │  │  • estado_venta (disponible/vendida/reservada)             │    │   │
│  │  │  • id_tienda (FK), id_expo (FK)                            │    │   │
│  │  │  • created_at, updated_at                                  │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  tiendas                                                   │    │   │
│  │  │  • id_tienda (PK)                                          │    │   │
│  │  │  • nombre                                                  │    │   │
│  │  │  • lat, lng (coordinates)                                  │    │   │
│  │  │  • url_tienda                                              │    │   │
│  │  │  • created_at                                              │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  expos                                                     │    │   │
│  │  │  • id_expo (PK)                                            │    │   │
│  │  │  • nombre                                                  │    │   │
│  │  │  • lat, lng (coordinates)                                  │    │   │
│  │  │  • fecha_inicio, fecha_fin                                 │    │   │
│  │  │  • url_expo                                                │    │   │
│  │  │  • created_at                                              │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  imagenes                                                  │    │   │
│  │  │  • id_imagen (PK)                                          │    │   │
│  │  │  • id_obra (FK → obras, CASCADE DELETE)                    │    │   │
│  │  │  • url (Cloudinary URL)                                    │    │   │
│  │  │  • public_id (Cloudinary ID)                               │    │   │
│  │  │  • created_at                                              │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  ordenes                                                   │    │   │
│  │  │  • id_orden (PK)                                           │    │   │
│  │  │  • id_user (Firebase UID)                                  │    │   │
│  │  │  • obras (JSONB array)                                     │    │   │
│  │  │  • total (DECIMAL)                                         │    │   │
│  │  │  • status (pending/paid/shipped/delivered)                 │    │   │
│  │  │  • shipping (JSONB object)                                 │    │   │
│  │  │  • payment_intent_id (Stripe)                              │    │   │
│  │  │  • created_at                                              │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  INDEXES:                                                           │   │
│  │  • idx_obras_estado ON obras(estado_venta)                          │   │
│  │  • idx_obras_tienda ON obras(id_tienda)                             │   │
│  │  • idx_imagenes_obra ON imagenes(id_obra)                           │   │
│  │  • idx_ordenes_user ON ordenes(id_user)                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────┐
│   FIREBASE AUTH        │  │     CLOUDINARY         │  │  STRIPE PAYMENTS │
│   (Authentication)     │  │   (Image CDN)          │  │   (Processing)   │
├────────────────────────┤  ├────────────────────────┤  ├──────────────────┤
│ • User registration    │  │ • Image uploads        │  │ • Payment intents│
│ • Email/Password auth  │  │ • Auto optimization    │  │ • Card payments  │
│ • JWT token generation │  │ • Format conversion    │  │ • MXN currency   │
│ • Token verification   │  │ • Transformations      │  │ • Webhooks       │
│ • Role management      │  │ • CDN delivery         │  │ • 3D Secure      │
│   (admin/user)         │  │ • f_auto, q_auto       │  │                  │
└────────────────────────┘  └────────────────────────┘  └──────────────────┘
         ▲                           ▲                          ▲
         │                           │                          │
         └───────────────┬───────────┴──────────────┬───────────┘
                         │                          │
         ┌───────────────┴──────────┐  ┌────────────┴──────────┐
         │      EMAILJS             │  │    LEAFLET MAPS       │
         │   (Notifications)        │  │   (Location Display)  │
         ├──────────────────────────┤  ├───────────────────────┤
         │ • Order confirmations    │  │ • Store markers       │
         │ • Delivery notifications │  │ • Expo locations      │
         │ • Template emails        │  │ • Interactive map     │
         │ • No backend required    │  │ • OpenStreetMap data  │
         └──────────────────────────┘  └───────────────────────┘


## 🔄 FLUJO DE DATOS DETALLADO

### 1️⃣ FLUJO DE AUTENTICACIÓN

```
┌──────────────┐
│   Usuario    │
│ Login Form   │
└──────┬───────┘
       │ email + password
       ▼
┌──────────────────────────────┐
│  Firebase Auth (Frontend)    │
│  signInWithEmailAndPassword()│
└──────┬───────────────────────┘
       │ Success
       ▼
┌──────────────────────────────┐
│  Get ID Token                │
│  user.getIdToken()           │
└──────┬───────────────────────┘
       │ JWT Token
       ▼
┌──────────────────────────────┐
│  AuthContext Update          │
│  setUser({ ...user, token }) │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Local Storage Update        │
│  (Optional: persist session) │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Redirect to Dashboard       │
│  (if role === 'admin')       │
└──────────────────────────────┘
```

### 2️⃣ FLUJO DE CREACIÓN DE OBRA (Admin)

```
┌──────────────┐
│    Admin     │
│ ObraFormCreate│
└──────┬───────┘
       │ Submit form data
       ▼
┌──────────────────────────────┐
│  useCreateObra() mutation    │
│  (React Query)               │
└──────┬───────────────────────┘
       │ POST /api/obras
       ▼
┌──────────────────────────────┐
│  clientWithAuth.post()       │
│  + Bearer Token              │
└──────┬───────────────────────┘
       │ HTTP Request
       ▼
┌──────────────────────────────┐
│  Express Server              │
│  POST /api/obras             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  authMiddleware              │
│  • Verify Firebase token     │
│  • Extract user → req.user   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  obrasController.create()    │
│  • Validate request body     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  obrasService.createObra()   │
│  • Business validations      │
│  • Data transformation       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  obrasRepo.create()          │
│  • INSERT INTO obras         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  PostgreSQL Database         │
│  • Execute INSERT            │
│  • Return new row            │
└──────┬───────────────────────┘
       │ New obra object
       ▼
┌──────────────────────────────┐
│  Response Chain              │
│  repo → service → controller │
└──────┬───────────────────────┘
       │ HTTP 201 + JSON
       ▼
┌──────────────────────────────┐
│  React Query                 │
│  • Update cache              │
│  • Invalidate ['obras']      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  UI Update                   │
│  • ObrasTable re-renders     │
│  • New obra appears in list  │
│  • Success toast notification│
└──────────────────────────────┘
```

### 3️⃣ FLUJO DE SUBIDA DE IMÁGENES

```
┌──────────────┐
│    Admin     │
│ Image Upload │
│    Input     │
└──────┬───────┘
       │ Select file(s)
       ▼
┌──────────────────────────────┐
│  useUploadImage() mutation   │
│  (React Query)               │
└──────┬───────────────────────┘
       │ FormData with file
       ▼
┌──────────────────────────────┐
│  POST /api/images            │
│  Content-Type: multipart     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Express + Multer Middleware │
│  • Parse multipart/form-data │
│  • Save to temp folder       │
│  • req.file available        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  imagesController.upload()   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  imagesService.uploadImage() │
│  • Validate file size        │
│  • Validate file format      │
└──────┬───────────────────────┘
       │ Valid file
       ▼
┌──────────────────────────────┐
│  Cloudinary Upload           │
│  cloudinary.uploader.upload()│
│  • Transform (1200x1200)     │
│  • Quality: auto             │
│  • Format: auto              │
└──────┬───────────────────────┘
       │ { url, public_id }
       ▼
┌──────────────────────────────┐
│  imagesRepo.create()         │
│  • INSERT INTO imagenes      │
│  • Save url + public_id      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Delete temp file            │
│  fs.unlink(file.path)        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Response                    │
│  { id, url, public_id }      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  UI Update                   │
│  • Display uploaded image    │
│  • Add to gallery            │
└──────────────────────────────┘
```

### 4️⃣ FLUJO DE COMPRA (Checkout)

```
┌──────────────┐
│   Usuario    │
│ Add to Cart  │
└──────┬───────┘
       │ Click "Add to Cart"
       ▼
┌──────────────────────────────┐
│  CartContext.addItem()       │
│  • Update cart state         │
│  • Save to localStorage      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Navigate to /cart           │
│  • Show cart items           │
│  • Calculate total           │
└──────┬───────────────────────┘
       │ Click "Checkout"
       ▼
┌──────────────────────────────┐
│  /checkout (CheckoutPage)    │
│  Step 1: ShippingForm        │
└──────┬───────────────────────┘
       │ Fill shipping info
       │ (validated with useFormValidation)
       ▼
┌──────────────────────────────┐
│  Step 2: PaymentForm         │
│  (Stripe CardElement)        │
└──────┬───────────────────────┘
       │ Enter card details
       ▼
┌──────────────────────────────┐
│  Submit Payment              │
│  useStripePayment()          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  POST /api/payments/intent   │
│  { amount, currency: 'mxn' } │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Stripe API                  │
│  stripe.paymentIntents       │
│  .create()                   │
└──────┬───────────────────────┘
       │ { clientSecret }
       ▼
┌──────────────────────────────┐
│  Frontend Stripe             │
│  stripe.confirmCardPayment() │
│  • Validate card             │
│  • 3D Secure if needed       │
└──────┬───────────────────────┘
       │ Payment successful
       ▼
┌──────────────────────────────┐
│  POST /api/orders            │
│  { obras, total, shipping,   │
│    payment_intent_id }       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  ordersService.createOrder() │
│  • Validate stock            │
│  • Create order in DB        │
│  • Update obra status        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  EmailJS                     │
│  • Send confirmation email   │
│  • Include order details     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Response                    │
│  { orderId, status: 'paid' } │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Navigate to /success        │
│  • Show order confirmation   │
│  • Clear cart                │
└──────────────────────────────┘
```

### 5️⃣ FLUJO DE BÚSQUEDA Y FILTRADO (Public Shop)

```
┌──────────────┐
│   Usuario    │
│  ShopPage    │
└──────┬───────┘
       │ Page load
       ▼
┌──────────────────────────────┐
│  useObras() query            │
│  { page: 1, pageSize: 12,    │
│    sort: { key, dir } }      │
└──────┬───────────────────────┘
       │ GET /api/obras?...
       ▼
┌──────────────────────────────┐
│  obrasController.list()      │
│  • Extract query params      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  obrasService.getAllObras()  │
│  • Build WHERE clause        │
│  • Build ORDER BY clause     │
│  • Calculate OFFSET, LIMIT   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  obrasRepo.findAll()         │
│  SELECT * FROM obras         │
│  WHERE estado_venta = ?      │
│  ORDER BY ? ?                │
│  LIMIT ? OFFSET ?            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  PostgreSQL                  │
│  • Execute query             │
│  • Return rows + total count │
└──────┬───────────────────────┘
       │ { obras: [...], total }
       ▼
┌──────────────────────────────┐
│  Response                    │
│  HTTP 200 + JSON             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  React Query Cache           │
│  • Store with key:           │
│    ['obras', { page, sort }] │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  UI Render                   │
│  • Map obras → ObraCard      │
│  • Show pagination controls  │
└──────────────────────────────┘
       │
       │ User types in search
       ▼
┌──────────────────────────────┐
│  useObraSearch() hook        │
│  • Filter client-side        │
│  • Match titulo, autor       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  UI Re-render                │
│  • Show filtered results     │
│  • No API call (client-side) │
└──────────────────────────────┘
```

### 6️⃣ FLUJO DE RENDERIZADO 3D (Admin Dashboard)

```
┌──────────────┐
│    Admin     │
│  Dashboard   │
└──────┬───────┘
       │ Navigate to /dashboard
       ▼
┌──────────────────────────────┐
│  HomePage.tsx                │
│  (Admin Dashboard)           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Check screen size           │
│  const isMobile = width<1024 │
└──────┬───────────────────────┘
       │
       ├─ Desktop ──────────────┐
       │                        ▼
       │              ┌──────────────────────┐
       │              │  Model3DGallery      │
       │              │  models={3}          │
       │              └──────┬───────────────┘
       │                     │
       │                     ▼
       │              ┌──────────────────────┐
       │              │  Render 3 Model3D    │
       │              │  components in grid  │
       │              └──────┬───────────────┘
       │                     │
       ▼                     ▼
┌────────────────────────────────────┐
│  Model3D.tsx                       │
│  • React Three Fiber <Canvas>      │
│  • useGLTF(cloudinaryUrl)          │
│  • OrbitControls                   │
│  • PerspectiveCamera               │
└──────┬─────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Load .glb from Cloudinary   │
│  • Draco compressed          │
│  • ~5-10MB per model         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Decompress with DracoLoader │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Three.js Scene              │
│  • Render 3D mesh            │
│  • Apply materials           │
│  • Enable interactions       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Auto-rotation animation     │
│  useFrame(() => {            │
│    rotation.y += 0.01        │
│  })                          │
└──────────────────────────────┘
```


## 🔐 DIAGRAMA DE SEGURIDAD

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: FRONTEND ROUTE PROTECTION
┌──────────────────────────────────┐
│  ProtectedRoute Component        │
│  ├─ Check: user authenticated?   │
│  ├─ Check: user.role === 'admin'?│
│  ├─ Redirect: /login             │
│  └─ Redirect: /unauthorized      │
└──────────────────────────────────┘

Layer 2: API AUTHENTICATION
┌──────────────────────────────────┐
│  authMiddleware                  │
│  ├─ Extract: Bearer token        │
│  ├─ Verify: Firebase Admin SDK   │
│  │   admin.auth()                │
│  │   .verifyIdToken(token)       │
│  ├─ Decode: user info            │
│  └─ Attach: req.user             │
└──────────────────────────────────┘

Layer 3: ROLE-BASED ACCESS CONTROL
┌──────────────────────────────────┐
│  Controller Level                │
│  ├─ Check: req.user exists?      │
│  ├─ Check: req.user.role?        │
│  └─ Authorize: admin actions     │
└──────────────────────────────────┘

Layer 4: INPUT VALIDATION
┌──────────────────────────────────┐
│  Service Layer                   │
│  ├─ Validate: data types         │
│  ├─ Sanitize: SQL injection      │
│  ├─ Validate: business rules     │
│  └─ Validate: file uploads       │
└──────────────────────────────────┘

Layer 5: DATABASE SECURITY
┌──────────────────────────────────┐
│  PostgreSQL                      │
│  ├─ Parameterized queries        │
│  ├─ Connection pooling           │
│  ├─ SSL/TLS encryption           │
│  └─ Environment variables        │
└──────────────────────────────────┘

Layer 6: EXTERNAL SERVICE SECURITY
┌──────────────────────────────────┐
│  API Keys & Secrets              │
│  ├─ Firebase: Service account    │
│  ├─ Stripe: Secret key           │
│  ├─ Cloudinary: API secret       │
│  └─ All in .env (never commit)   │
└──────────────────────────────────┘
```


## 📦 DIAGRAMA DE COMPONENTES POR FEATURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC FEATURES                              │
└─────────────────────────────────────────────────────────────────┘

HOMEPAGE
├─ HeroSection
│  ├─ LogoLoop (4x Piedra art logo)
│  └─ StoresSection (3 shop logos)
├─ WelcomeSection
│  ├─ Layer 1: piedra_svgs-20.png (Cloudinary)
│  ├─ Layer 2: piedra  svgs-05.svg (rotating)
│  ├─ Layer 3: piedra_svgs-21.png (Cloudinary)
│  └─ Layer 4: piedra  svgs-15.svg (front)
├─ GallerySection
│  ├─ Decorative SVG 1
│  ├─ Decorative SVG 2
│  └─ Framer Motion scroll animations
└─ Footer
   └─ piedra-logo-white.svg

SHOP
├─ ObrasGrid
│  └─ ObraCard (x12 per page)
│     ├─ Image (first from imagenes)
│     ├─ Title, Author, Price
│     └─ "Add to Cart" button
├─ Search Input (client-side filter)
└─ Pagination Controls

CART
├─ CartItemList
│  └─ CartItem
│     ├─ Image, Title, Price
│     └─ Remove button
├─ OrderSummary
│  ├─ Subtotal
│  ├─ IVA (16%)
│  └─ Total
└─ "Proceed to Checkout" button

CHECKOUT
├─ Step 1: ShippingForm
│  ├─ PersonalInfo (email, nombre, telefono)
│  ├─ Address (direccion, colonia, CP, ciudad, estado)
│  └─ Real-time validation (useFormValidation)
├─ Step 2: PaymentForm
│  ├─ Stripe CardElement
│  ├─ Card brand detection
│  └─ Visual feedback (green/red border)
├─ OrderSummary (always visible)
└─ Step 3: OrderSuccess
   ├─ Order ID
   ├─ Email confirmation sent
   └─ "View My Orders" link

MY ORDERS
├─ useUserOrders() query
├─ OrderCard (foreach order)
│  ├─ Order ID, Date, Total
│  ├─ Status badge
│  └─ Items list
└─ Empty state ("No orders yet")


┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN FEATURES                               │
└─────────────────────────────────────────────────────────────────┘

DASHBOARD (HomePage)
├─ Model3DGallery
│  └─ Model3D (x3 desktop, x1 mobile)
│     ├─ "Balancing Act" model
│     ├─ "Pebble Art" model
│     └─ "Piedra Arte" model
└─ Stats Cards
   ├─ Total Obras (clickable → /obras)
   ├─ Total Tiendas (clickable → /tiendas)
   └─ Total Exposiciones (clickable → /expos)

OBRAS PAGE
├─ Mobile (<lg)
│  └─ Accordion
│     ├─ Item 1: "Subir piedra"
│     │  └─ ObraFormCreate
│     └─ Item 2: "Inventario"
│        ├─ Search Input
│        ├─ ObrasTable
│        └─ Pagination
├─ Desktop (≥lg)
│  ├─ Grid [1fr_2fr]
│  │  ├─ ObraFormCreate
│  │  └─ ObrasTable + Search + Pagination
│  └─ Grid [1fr_2fr] (Charts Row)
│     ├─ (empty space)
│     └─ Tab Navigation
│        ├─ ObrasUbicacionChart (Recharts Pie)
│        ├─ ObrasVentasChart (Recharts Line)
│        └─ LocationsMap (Leaflet)
└─ ObraEditModal (shared)
   ├─ Edit form (all fields)
   ├─ Image gallery upload
   └─ Email delivery notification (EmailJS)

TIENDAS PAGE
├─ Model3D ("Balancing Act")
├─ LocationForm
│  ├─ nombre
│  ├─ lat, lng (coordinates)
│  └─ url_tienda
├─ LocationTable
│  ├─ Columns: Nombre, Lat, Lng, URL, Actions
│  └─ Actions: Edit, Delete
└─ LocationEditModal

EXPOSICIONES PAGE
├─ Model3D ("Pebble Art")
├─ LocationForm
│  ├─ nombre
│  ├─ lat, lng
│  ├─ DatePicker (fecha_inicio)
│  ├─ DatePicker (fecha_fin)
│  └─ url_expo
├─ LocationTable
│  ├─ Columns: Nombre, Fechas, Lat, Lng, URL, Actions
│  └─ Actions: Edit, Delete
└─ LocationEditModal + DatePickers


┌─────────────────────────────────────────────────────────────────┐
│                    SHARED COMPONENTS                            │
└─────────────────────────────────────────────────────────────────┘

LAYOUT
├─ PublicLayout
│  ├─ LiquidEther (background animation)
│  ├─ LogoLoop (corner SVG animation)
│  ├─ PillNav
│  └─ {children}
├─ AdminLayout (implicit via AdminNav)
│  ├─ AdminNav
│  └─ {children}
└─ Footer (public only)

NAVIGATION
├─ PillNav (Public)
│  ├─ Pills: Inicio, Tienda, Mis Compras
│  ├─ Cart button (with badge)
│  ├─ Admin button (if role=admin)
│  ├─ Theme toggle
│  └─ Auth section (Login/Logout)
└─ AdminNav
   ├─ Logo (large, offset right)
   ├─ Pills: Dashboard, Obras, Tiendas, Expos
   └─ Right: Home, Theme, User Info, Logout

UI COMPONENTS (shadcn/ui)
├─ Card, CardHeader, CardTitle, CardContent
├─ Button, Input, Label
├─ Table, TableHeader, TableBody, TableRow, TableCell
├─ Accordion, AccordionItem, AccordionTrigger, AccordionContent
├─ Tabs, TabsList, TabsTrigger, TabsContent
├─ Select, SelectTrigger, SelectValue, SelectContent, SelectItem
├─ Badge
└─ Toast (notifications)
```


## 🗄️ DIAGRAMA DE BASE DE DATOS (Relaciones)

```
┌─────────────────────────┐
│       tiendas           │
│─────────────────────────│
│ id_tienda (PK)          │
│ nombre                  │
│ lat                     │
│ lng                     │
│ url_tienda              │
│ created_at              │
└────────┬────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│       obras             │          │       expos             │
│─────────────────────────│          │─────────────────────────│
│ id_obra (PK)            │          │ id_expo (PK)            │
│ titulo                  │          │ nombre                  │
│ autor                   │          │ lat                     │
│ tecnica                 │          │ lng                     │
│ anio                    │          │ fecha_inicio            │
│ precio                  │          │ fecha_fin               │
│ descripcion             │          │ url_expo                │
│ estado_venta            │          │ created_at              │
│ id_tienda (FK) ─────────┘          └────────────────────────┘
│ id_expo (FK) ───────────────────────┘
│ created_at              │
│ updated_at              │
└────────┬────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────────┐
│       imagenes          │
│─────────────────────────│
│ id_imagen (PK)          │
│ id_obra (FK)            │ ON DELETE CASCADE
│ url                     │ (Cloudinary URL)
│ public_id               │ (Cloudinary ID)
│ created_at              │
└─────────────────────────┘


┌─────────────────────────┐
│       ordenes           │
│─────────────────────────│
│ id_orden (PK)           │
│ id_user                 │ (Firebase UID, no FK)
│ obras (JSONB)           │ [{id_obra, titulo, precio, qty}]
│ total                   │
│ status                  │ (pending/paid/shipped/delivered)
│ shipping (JSONB)        │ {email, nombre, direccion, ...}
│ payment_intent_id       │ (Stripe Payment Intent ID)
│ created_at              │
└─────────────────────────┘

RELATIONSHIPS:
- tiendas.id_tienda ←─ obras.id_tienda (1:N)
- expos.id_expo ←─ obras.id_expo (1:N)
- obras.id_obra ←─ imagenes.id_obra (1:N, CASCADE DELETE)
- ordenes.obras contains obra IDs (no FK, JSONB array)
```


## 🚀 DIAGRAMA DE DEPLOYMENT

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                              │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (Vercel)
┌────────────────────────────┐
│  Vercel Edge Network       │
│  ├─ Static assets (Vite)   │
│  ├─ React SPA              │
│  ├─ Auto HTTPS             │
│  ├─ CDN caching            │
│  └─ Environment variables  │
│     ├─ VITE_API_URL        │
│     ├─ VITE_FIREBASE_*     │
│     ├─ VITE_STRIPE_PK      │
│     └─ VITE_CLOUDINARY_*   │
└────────────────────────────┘

BACKEND (Vercel Serverless)
┌────────────────────────────┐
│  Vercel Functions          │
│  ├─ Express app (wrapped)  │
│  ├─ Auto scaling           │
│  ├─ Region: US East        │
│  └─ Environment variables  │
│     ├─ DB_HOST             │
│     ├─ DB_USER             │
│     ├─ DB_PASSWORD         │
│     ├─ FIREBASE_*          │
│     ├─ STRIPE_SECRET_KEY   │
│     └─ CLOUDINARY_*        │
└────────────────────────────┘

DATABASE
┌────────────────────────────┐
│  PostgreSQL (Cloud)        │
│  Options:                  │
│  ├─ Vercel Postgres        │
│  ├─ Railway                │
│  └─ Supabase               │
│                            │
│  Features:                 │
│  ├─ Connection pooling     │
│  ├─ SSL/TLS encryption     │
│  ├─ Automated backups      │
│  └─ High availability      │
└────────────────────────────┘

EXTERNAL SERVICES
┌────────────────────────────┐
│  Firebase Auth             │
│  ├─ User management        │
│  └─ JWT token generation   │
└────────────────────────────┘
┌────────────────────────────┐
│  Cloudinary CDN            │
│  ├─ Image storage          │
│  ├─ 3D model delivery      │
│  └─ Auto optimization      │
└────────────────────────────┘
┌────────────────────────────┐
│  Stripe Payments           │
│  ├─ Payment processing     │
│  └─ Webhook handling       │
└────────────────────────────┘
┌────────────────────────────┐
│  EmailJS                   │
│  └─ Email notifications    │
└────────────────────────────┘

BUILD PIPELINE
┌────────────────────────────┐
│  Git Push → GitHub         │
│         ↓                  │
│  Vercel Auto Deploy        │
│  ├─ Install dependencies   │
│  ├─ Build frontend (Vite)  │
│  ├─ Build backend (tsc)    │
│  ├─ Run migrations (?)     │
│  └─ Deploy to production   │
│         ↓                  │
│  Health Check              │
│  └─ GET /api/health        │
└────────────────────────────┘
```


## 📊 PERFORMANCE OPTIMIZATION DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE STRATEGIES                       │
└─────────────────────────────────────────────────────────────────┘

FRONTEND OPTIMIZATIONS
├─ Code Splitting
│  ├─ React.lazy() for routes
│  ├─ Dynamic imports for heavy components
│  └─ Vite automatic chunking
├─ Image Optimization
│  ├─ Cloudinary CDN delivery
│  ├─ f_auto (format auto-select: WebP, AVIF)
│  ├─ q_auto (quality auto-adjust)
│  └─ Responsive transformations
├─ 3D Model Optimization
│  ├─ Draco compression (50-90% size reduction)
│  ├─ Cloudinary CDN delivery
│  ├─ Lazy loading (only on dashboard)
│  └─ Responsive: 1 model mobile, 3 desktop
├─ React Query Caching
│  ├─ Stale-while-revalidate strategy
│  ├─ 5-minute cache time
│  ├─ Background refetch
│  └─ Optimistic updates
├─ Framer Motion
│  ├─ GPU-accelerated transforms
│  ├─ clipPath animations (not opacity)
│  └─ Visibility-based triggers
└─ Bundle Optimization
   ├─ Tree shaking (Vite)
   ├─ Minification (Terser)
   └─ Compression (gzip, brotli)

BACKEND OPTIMIZATIONS
├─ Database
│  ├─ Indexed queries (estado_venta, id_tienda, etc.)
│  ├─ Connection pooling (pg Pool)
│  ├─ Pagination (LIMIT/OFFSET)
│  └─ Prepared statements
├─ API Response
│  ├─ JSON compression (gzip)
│  ├─ Minimal data transfer
│  └─ HTTP caching headers
└─ Cloudinary Upload
   ├─ Transform on upload (1200x1200 limit)
   ├─ Auto quality adjustment
   └─ Async processing

NETWORK OPTIMIZATIONS
├─ CDN Usage
│  ├─ Cloudinary (images, 3D models)
│  ├─ Vercel Edge Network (static assets)
│  └─ Firebase (auth endpoints)
├─ HTTP/2
│  └─ Multiplexing, header compression
├─ Lazy Loading
│  ├─ Images: loading="lazy" (planned)
│  ├─ Components: React.lazy()
│  └─ Routes: code splitting
└─ Prefetching
   └─ React Query prefetchQuery (planned)
```

---

## 📈 ESCALABILIDAD Y FUTURAS MEJORAS

### Posibles Mejoras Arquitectónicas

1. **Backend Escalability**
   - Migrar a microservicios (obras, orders, payments)
   - Implementar message queue (Bull, RabbitMQ)
   - Cache layer (Redis) para queries frecuentes

2. **Frontend Performance**
   - Implementar Service Workers (PWA)
   - Agregar skeleton screens
   - Virtual scrolling para listas largas

3. **Database**
   - Implementar full-text search (PostgreSQL FTS)
   - Agregar réplicas de lectura
   - Particionar tablas grandes (ordenes por año)

4. **Monitoring & Analytics**
   - Application Performance Monitoring (Sentry, DataDog)
   - User analytics (Google Analytics, Mixpanel)
   - Error tracking y logging centralizado

5. **Security Enhancements**
   - Rate limiting (express-rate-limit)
   - CSRF tokens
   - Input sanitization library (DOMPurify)
   - Content Security Policy headers

---

**Última actualización:** 2025-10-27
**Versión:** 1.0
**Creado para:** Sprint-8 Art Gallery Project
