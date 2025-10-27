# Art Gallery E-Commerce Platform - Architecture Analysis

**Project:** Sprint-8-art-gallery
**Type:** Full-stack React + Node.js/Express + MySQL E-Commerce Platform
**Total Lines of Code:** ~14,800 (frontend)
**Tech Stack:** Vite, TypeScript, React 19, TailwindCSS, Stripe, Firebase, 3D Models (Three.js)

---

## 1. PROJECT STRUCTURE

### Root Directory Layout
```
/Users/rick/Documents/Academy/Sprint-8-art-gallery/
├── src/                          # Frontend (React)
├── api/                          # Backend (Express API)
├── public/                       # Static assets
├── dist/                         # Build output
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite build configuration
├── vitest.config.ts             # Testing configuration
├── index.html                   # Entry point
├── .env.example                 # Environment template
├── ARQUITECTURA-PROYECTO.md     # (Existing architecture docs)
└── Documentation files          # Guides, deployment, security
```

### Technology Stack & Versions

**Frontend (React):**
- React 19.1.1
- React Router DOM 7.9.3
- Vite 7.1.7
- TypeScript 5.8.3
- TailwindCSS 4.1.13

**State Management & Data:**
- TanStack React Query 5.90.2 (Server State)
- TanStack React Table 8.21.3 (Table management)
- Context API (Auth & Cart)
- React Hook Form 7.63.0 (Forms)

**UI Components & Styling:**
- Radix UI (Accordion, Dialog, Select, Dropdown, etc.)
- Lucide React 0.544.0 (Icons)
- Shadcn/UI (Built on Radix)
- Sonner 2.0.7 (Toast notifications)
- CVA (Class Variance Authority)

**3D & Animation:**
- Three.js 0.180.0 (3D rendering)
- React Three Fiber 9.4.0 (React wrapper for Three.js)
- React Three Drei 10.7.6 (Utilities & models)
- Framer Motion 12.23.24 (Animations)
- Motion DOM 12.23.23 (DOM animations)

**Payment & Auth:**
- Stripe (@stripe/react-stripe-js 5.2.0, @stripe/stripe-js 8.0.0)
- Firebase 12.4.0 (Authentication, Auth Admin)
- Firebase Admin SDK (Backend)

**Other Libraries:**
- Leaflet 1.9.4 + React Leaflet 5.0.0 (Maps)
- Recharts 2.15.4 (Charts & Analytics)
- date-fns 4.1.0 (Date utilities)
- Zod 4.1.11 (Schema validation)
- EmailJS 4.4.1 (Email notifications)
- MathJS 15.0.0 (Math calculations)
- Next Themes 0.4.6 (Dark mode)

**Backend (Express):**
- Express 5.1.0
- MySQL2 3.15.1 (Database)
- Stripe 19.1.0
- Firebase Admin 13.5.0
- Cloudinary 2.7.0 (Image CDN)
- Multer 2.0.2 (File uploads)
- Helmet 8.1.0 (Security)
- Express Rate Limit 8.1.0
- CORS 2.8.5
- Zod 4.1.11

**Development Tools:**
- Vitest 3.2.4 (Unit tests)
- Testing Library (React, Jest DOM)
- ESLint 9.36.0
- TypeScript ESLint 8.44.0

---

## 2. FRONTEND ARCHITECTURE

### Directory Structure: `/src`

```
src/
├── components/                   # Reusable components (74 components)
│   ├── 3D/                      # 3D model components
│   │   └── Model3D.tsx          # 3D model viewer with scroll rotation
│   ├── Admin/                   # Admin-specific components
│   │   └── Model3DGallery.tsx   # 3D gallery for dashboard
│   ├── Cart/                    # Cart management
│   │   └── CartItem.tsx         # Individual cart item
│   ├── Checkout/                # Checkout flow
│   │   ├── AddressSelector.tsx
│   │   ├── PaymentForm.tsx      # Stripe integration
│   │   ├── ShippingForm.tsx
│   │   └── OrderSummary.tsx
│   ├── Expos/                   # Exhibitions management
│   │   └── ExposPage.tsx
│   ├── Home/                    # Home page sections
│   │   ├── HomePage.tsx         # Admin dashboard
│   │   ├── HeroSection.tsx
│   │   ├── WelcomeSection.tsx
│   │   ├── GallerySection.tsx
│   │   └── LayerControls.tsx
│   ├── Obra/                    # Artwork detail
│   │   ├── ObraImageGallery.tsx
│   │   ├── ObraInfo.tsx
│   │   └── ObraActions.tsx
│   ├── Obras/                   # Artwork admin management
│   │   ├── ObrasPage.tsx        # List & manage
│   │   ├── ObrasTable.tsx       # Data table
│   │   ├── ObraFormCreate.tsx   # Create/edit form
│   │   ├── ObraEditModal.tsx
│   │   ├── ObrasVentasChart.tsx # Sales analytics
│   │   ├── ObrasUbicacionChart.tsx
│   │   └── LocationsMap.tsx     # Map integration
│   ├── Orders/                  # Order management
│   │   ├── OrdersPage.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── OrderCard.tsx
│   │   ├── NewOrderCard.tsx
│   │   └── OrderDetailModal.tsx
│   ├── Shop/                    # E-commerce shop
│   │   └── ObraCard.tsx         # Product card
│   ├── Tiendas/                 # Store locations
│   │   └── TiendasPage.tsx
│   ├── animations/              # Animation utilities
│   │   └── Magnet.tsx           # Magnetic hover effect
│   ├── auth/                    # Authentication
│   │   └── ProtectedRoute.tsx   # Role-based access
│   ├── backgrounds/             # Background effects
│   │   └── LiquidEther.tsx
│   ├── common/                  # Utility components
│   │   └── ObraImage.tsx        # Cloudinary image loader
│   ├── layout/                  # Layout wrappers
│   │   ├── PublicLayout.tsx     # Main layout wrapper
│   │   ├── AdminNav.tsx         # Admin navigation
│   │   ├── LogoLoop.tsx
│   │   ├── PillNav.tsx
│   │   └── Footer.tsx
│   ├── shared/                  # Shared components
│   │   ├── LocationEditModal.tsx
│   │   ├── LocationForm.tsx
│   │   └── LocationTable.tsx
│   └── ui/                      # UI primitives (Shadcn/Radix)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── table.tsx
│       ├── select.tsx
│       ├── dropdown-menu.tsx
│       ├── accordion.tsx
│       ├── date-picker.tsx
│       ├── chart.tsx
│       ├── pagination.tsx
│       └── ... (17 more UI components)
│
├── pages/                       # Page components (9 pages)
│   ├── PublicHome.tsx          # Home page
│   ├── ShopPage.tsx            # Shop/catalog
│   ├── CartPage.tsx            # Shopping cart
│   ├── ObraDetailPage.tsx      # Artwork detail view
│   ├── CheckoutPage.tsx        # Stripe checkout
│   ├── MyOrdersPage.tsx        # User orders
│   ├── LoginPage.tsx           # Authentication
│   ├── DashboardPage.tsx       # Admin dashboard
│   └── UnauthorizedPage.tsx
│
├── context/                     # State management
│   ├── AuthContextFirebase.tsx # Auth provider (Firebase)
│   ├── AuthContext.tsx         # Legacy auth
│   └── CartContext.tsx         # Cart provider (TanStack Query)
│
├── hooks/                       # Custom React hooks
│   ├── useReservas.ts          # Cart management (reservations)
│   ├── useCheckoutForm.ts      # Checkout form state
│   ├── useStripePayment.ts     # Stripe payment processing
│   ├── useOrders.ts            # Orders queries
│   ├── useOrdersFilters.ts     # Orders filtering
│   ├── useDirecciones.ts       # Addresses management
│   ├── useObraForm.ts          # Artwork form state
│   ├── useObraImages.ts        # Image management
│   ├── useObraSearch.ts        # Search functionality
│   ├── useObraSort.ts          # Sorting
│   ├── useIsInCart.ts          # Cart status check
│   ├── useObraEdit.ts          # Edit state management
│   ├── useFormValidation.ts    # Form validation
│   ├── useAsyncAction.ts       # Async operations
│   └── useNotifications.ts     # Toast notifications
│
├── query/                       # TanStack React Query hooks
│   ├── obras.ts                # Artwork queries & mutations
│   ├── orders.ts               # Orders queries
│   ├── tiendas.ts              # Stores queries
│   ├── expos.ts                # Exhibitions queries
│   └── images.ts               # Images queries
│
├── services/                    # API service layer
│   ├── obrasService.ts         # Artwork API
│   ├── imageService.ts         # Images API
│   ├── tiendasService.ts       # Stores API
│   └── expoService.ts          # Exhibitions API
│
├── api/                         # HTTP client
│   ├── client.ts               # Base fetch client
│   └── clientWithAuth.ts       # Authenticated requests
│
├── config/                      # Configuration
│   ├── firebase.ts             # Firebase initialization
│   ├── stripe.ts               # Stripe initialization
│   ├── queryClient.ts          # React Query config
│   ├── emailjs.ts              # EmailJS setup
│   ├── estadoConfig.ts         # Order states config
│   └── welcomeSvgs.ts          # SVG data
│
├── types/                       # TypeScript types
│   ├── index.ts                # Main export
│   ├── domain.ts               # Data models
│   ├── api.ts                  # API types
│   ├── orders.ts               # Order types
│   ├── forms.ts                # Form types
│   ├── components.ts           # Props types
│   └── navigation.ts           # Navigation types
│
├── utils/                       # Utility functions
│   ├── cn.ts                   # Class name merger
│   ├── formatters.ts           # Data formatting
│   ├── animations.ts           # Animation helpers
│   ├── session.ts              # Session management
│   └── ... (other utilities)
│
├── constants/                   # Application constants
│   └── cache.ts                # Cache configuration
│
├── lib/                         # Library adapters
│   └── framer-motion-mock.ts   # Mock for SSR
│
├── test/                        # Test utilities
├── assets/                      # Static assets
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
├── index.css                    # Global styles
└── types.ts                     # Root types
```

### Routes Configuration

**File:** `/src/routes/index.tsx`

**Public Routes:**
- `/` - Home page
- `/login` - Authentication
- `/shop` - Product catalog
- `/cart` - Shopping cart
- `/obra/:id` - Artwork detail
- `/my-orders` - User orders history
- `/unauthorized` - 403 error

**Protected Routes (Role-based):**
- `/checkout` - Checkout (admin + user)
- `/dashboard` - Admin dashboard (admin only)

### State Management Architecture

**1. Authentication (Firebase):**
- **Provider:** `AuthContextFirebase`
- **State:** User object with uid, email, role, name
- **Auth Types:** Email/password, Google OAuth
- **Role System:** "admin" | "user" (determined by email)
- **Token:** Firebase ID token + custom claims

**2. Cart Management (TanStack Query + Context):**
- **Provider:** `CartProvider`
- **Backend:** Reservas table with session-based tracking
- **State:** Array of CartItems (obra + quantity + reserva)
- **Features:**
  - Persistent reservations (30-minute timeout)
  - Session ID tracking for anonymous users
  - Real-time availability validation
  - Automatic price calculation

**3. Server State (TanStack Query):**
- Query caching (30s stale time, 5m garbage collection)
- Automatic refetch on window focus
- Optimistic updates for mutations
- Query key strategy: `[resource, filter1, filter2, ...]`

### Key Features Implementation

#### E-Commerce Flow
1. **Shop Page** → Display available artworks
2. **Detail Page** → View artwork with images + 3D model
3. **Add to Cart** → Create reservation + update cart context
4. **Cart Page** → Manage items, view totals
5. **Checkout** → Address selection/form + Stripe payment
6. **Success** → Order creation, email notification

#### Admin Features
- **Dashboard:** Stats, 3D model gallery
- **Obras:** CRUD operations, location assignment, sales charts
- **Orders:** List, status updates, tracking, analytics
- **Tiendas:** Create/manage store locations (maps)
- **Expos:** Create/manage exhibitions with dates
- **Analytics:** Revenue charts, location heatmaps

#### Performance Optimizations
- **Cloudinary Integration:** `ObraImage` component for lazy-loaded images
- **Image Optimization:** CDN delivery with responsive sizing
- **Chunk Splitting (Vite):** React, Radix UI, Framer Motion, Charts, TanStack
- **Code Splitting:** Page components with React.lazy
- **3D Model Optimization:**
  - Draco compression for GLB files
  - Performance throttling (dpr max 2)
  - Disabled antialias for performance
  - Scroll-based rotation instead of constant animation

---

## 3. BACKEND ARCHITECTURE

### Directory Structure: `/api`

```
api/
├── src/
│   ├── server.ts               # Express app setup
│   ├── middleware/
│   │   ├── authMiddleware.ts   # Firebase auth verification
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── index.ts            # Main router (routes aggregation)
│   │   ├── reservas.ts         # Cart management routes
│   │   └── direcciones.ts      # Address routes
│   ├── controllers/            # Request handlers
│   │   ├── obrasController.ts
│   │   ├── tiendasController.ts
│   │   ├── exposController.ts
│   │   ├── paymentsController.ts
│   │   ├── ordersController.ts
│   │   ├── imagesController.ts
│   │   ├── reservasController.ts
│   │   └── direccionesController.ts
│   ├── services/               # Business logic
│   │   ├── obrasService.ts
│   │   ├── ordersService.ts
│   │   ├── reservasService.ts
│   │   ├── direccionesService.ts
│   │   ├── imagesService.ts
│   │   ├── tiendasService.ts
│   │   └── exposService.ts
│   ├── repositories/           # Database access layer
│   │   ├── obrasRepo.ts
│   │   ├── ordersRepo.ts
│   │   ├── reservasRepo.ts
│   │   ├── direccionesRepo.ts
│   │   ├── imagesRepo.ts
│   │   ├── tiendasRepo.ts
│   │   └── expos.Repo.ts
│   ├── db/
│   │   └── pool.ts             # MySQL connection pool
│   ├── config/
│   │   ├── firebase-admin.ts
│   │   ├── cloudinary.ts
│   │   └── env.ts
│   ├── domain/
│   │   ├── types.ts            # Domain models
│   │   └── validation.ts       # Zod schemas
│   ├── utils/
│   │   └── helpers.ts          # Helper functions
│   └── scripts/
│       └── set-admin-role.ts   # Admin setup script
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

### API Endpoints Overview

**Base URL:** `http://localhost:3000/api`

#### Artworks (Obras)
- `GET /obras` - List all (pageable, sortable)
- `POST /obras` - Create (admin)
- `PUT /obras/:id` - Update (admin)
- `DELETE /obras/:id` - Delete (admin)
- `POST /obras/:id/asignar-tienda` - Assign to store (admin)
- `POST /obras/:id/sacar-tienda` - Remove from store (admin)
- `POST /obras/:id/asignar-expo` - Assign to exhibition (admin)
- `POST /obras/:id/quitar-expo` - Remove from exhibition (admin)

#### Images (Imágenes)
- `GET /obras/:id/imagenes` - List artwork images
- `POST /obras/:id/imagenes` - Upload image (admin, multipart)
- `DELETE /imagenes/:id` - Delete image (admin)

#### Stores (Tiendas)
- `GET /tiendas` - List stores
- `POST /tiendas` - Create (admin)
- `PUT /tiendas/:id` - Update (admin)
- `DELETE /tiendas/:id` - Delete (admin)

#### Exhibitions (Expos)
- `GET /expos` - List exhibitions
- `POST /expos` - Create (admin)
- `PUT /expos/:id` - Update (admin)
- `DELETE /expos/:id` - Delete (admin)

#### Payments (Stripe)
- `POST /payments/create-payment-intent` - Create Stripe intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/webhook` - Stripe webhooks

#### Orders
- `GET /orders` - Get by email (legacy)
- `POST /orders` - Create order (authenticated)
- `GET /orders/all` - List all (admin)
- `GET /orders/stats` - Statistics (admin)
- `GET /orders/my-orders` - User's orders (authenticated)
- `GET /orders/number/:orderNumber` - Track by number (public)
- `GET /orders/:id` - Get order (authenticated)
- `GET /orders/:id/history` - Status history (admin)
- `GET /orders/:id/summary` - Summary (public)
- `PUT /orders/:id/status` - Update status (admin)
- `POST /orders/:id/cancel` - Cancel order (authenticated)
- `POST /orders/:id/mark-paid` - Mark paid webhook (internal)

#### Cart/Reservations
- `POST /reservas/add` - Add to cart (session-based)
- `DELETE /reservas/remove/:id_obra` - Remove from cart
- `POST /reservas/validate` - Check availability
- `POST /reservas/validate-cart` - Validate whole cart
- `GET /reservas/my-cart` - Get cart items
- `DELETE /reservas/release-all` - Clear cart
- `POST /reservas/cleanup` - Clean expired (admin)

#### Addresses (Direcciones)
- `GET /direcciones` - List user addresses (authenticated)
- `POST /direcciones` - Create address (authenticated)
- `PUT /direcciones/:id` - Update address (authenticated)
- `DELETE /direcciones/:id` - Delete address (authenticated)

### Security & Authentication

**Authentication Strategy:**
- Firebase Auth (Client-side login)
- Firebase Admin SDK (Server-side token verification)
- Custom claims for admin role
- JWT tokens passed in headers

**Middleware:**
- `verifyFirebaseToken` - Checks valid Firebase token
- `requireAdmin` - Checks admin role
- `optionalAuth` - Auth if provided
- `errorHandler` - Global error handling

**Security Features:**
- Helmet.js (CSP headers, clickjacking protection)
- Rate limiting (100 req/15min general, 5 req/15min auth)
- CORS whitelist (specific domains, no wildcards)
- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)

### Database Layer

**Technology:** MySQL 8.0+

**Connection:** Pool with 10 max connections

**Key Tables:**
- `obras` - Artwork metadata
- `obras_imagenes` - Image references
- `tiendas` - Store locations
- `expos` - Exhibitions
- `obras_expos` - Artwork-exhibition relationships
- `reservas` - Shopping cart entries
- `ordenes` - Orders/purchases
- `ordenes_items` - Order line items
- `direcciones` - Shipping addresses
- `payment_intents` - Stripe payment tracking

**Views:**
- `obras_estado_actual` - Current artwork status with location info

### Service Layer Architecture

**Pattern:** Service → Repository → Database

Each service delegates data access to repositories:
- Handles business logic
- Validation using Zod schemas
- Transaction management
- Cross-resource coordination

**Example (Obras):**
- `obrasService.ts` - Validates input, manages relationships
- `obrasRepo.ts` - Raw database operations

---

## 4. COMPONENT RELATIONSHIPS & DATA FLOW

### Page Hierarchy
```
App
├── AuthProvider
│   └── CartProvider
│       └── BrowserRouter
│           └── AppRoutes
│               ├── PublicLayout
│               │   ├── LogoLoop
│               │   ├── PillNav
│               │   └── [Page Component]
│               │       └── (Page-specific components)
│               └── AdminLayout (DashboardPage)
│                   ├── AdminNav
│                   └── [Tab Component]
```

### Key Component Relationships

**1. Shopping Flow:**
```
ShopPage
├── useObras() → TanStack Query
├── useCart() → CartContext
└── ObraCard (mapped)
    └── onAddToCart → CartProvider.addToCart()
        └── useAddToCart() mutation → API POST /reservas/add
            └── Invalidate query ["reservas"]
                └── CartContext refetch

ObraDetailPage
├── useObras()
├── useObraImages() → Query images
└── ObraActions
    └── ObraImageGallery
        └── ObraImage (Cloudinary lazy-load)
```

**2. Checkout Flow:**
```
CheckoutPage
├── useCart() → Get cart items
├── useAuth() → Get user
├── useCheckoutForm() → Form state
├── useStripePayment() → Payment processing
│   ├── Address selection/entry
│   ├── ShippingForm or AddressSelector
│   ├── PaymentForm
│   │   └── Elements (Stripe provider)
│   │       └── CardElement
│   └── OrderSummary
└── onSubmit
    └── processPayment()
        ├── Create Stripe payment intent
        ├── Confirm payment
        └── Create order via API
            └── Clear cart
                └── Redirect to success
```

**3. Admin Dashboard:**
```
DashboardPage
├── AdminNav (tab switcher)
└── [Tab Content]
    ├── HomePage (stats + 3D gallery)
    │   ├── Model3DGallery
    │   │   └── Model3D (Three.js)
    │   └── Stats cards
    ├── ObrasPage (artwork management)
    │   ├── ObrasTable (TanStack Table)
    │   │   ├── useObras()
    │   │   └── useUpdateObra() mutation
    │   ├── ObraFormCreate
    │   │   └── useObraForm() + useCreateObra()
    │   ├── ObraEditModal
    │   │   └── useObraEdit()
    │   ├── LocationsMap (Leaflet)
    │   ├── ObrasVentasChart (Recharts)
    │   └── ObrasUbicacionChart
    ├── OrdersPage
    │   ├── OrdersTable
    │   │   ├── useOrders()
    │   │   └── useOrdersFilters()
    │   └── OrderDetailModal
    ├── TiendasPage (store management)
    │   └── LocationTable + LocationEditModal
    └── ExposPage (exhibition management)
        └── Similar structure
```

### Context Consumers

**AuthContext Consumers:**
- ProtectedRoute (access control)
- AdminNav (user info display)
- CartPage (auth check before checkout)
- CheckoutPage (address load for logged users)
- App-level auth state checks

**CartContext Consumers:**
- ShopPage (add to cart)
- ObraDetailPage (add to cart)
- CartPage (list & manage)
- CheckoutPage (get totals)
- PillNav (cart badge count)

---

## 5. KEY FEATURES DEEP DIVE

### 1. E-Commerce / Shopping

**Artwork Availability Management:**
```typescript
Estados de Venta:
- disponible → Can purchase
- en_carrito → Reserved by someone
- procesando_envio → In transit
- enviado → Shipped
- entregado → Delivered
- pendiente_devolucion → Return pending
- nunca_entregado → Failed delivery

Ubicación (Location):
- en_exposicion → Exhibition (can't purchase)
- en_tienda → Physical store (listed)
- tienda_online → Online store (purchasable)
- almacen → Warehouse (not listed)
```

**Reservation System (Session-based Cart):**
- No login required to add to cart
- Session ID stored in localStorage
- 30-minute expiration on reservations
- Real-time availability check
- Automatic cleanup of expired reservations

**Product Pages:**
- Shop page: Horizontal scroll of cards
- Detail page: Multi-image gallery + info + 3D model
- Images served from Cloudinary (optimized URLs)

### 2. Checkout & Payments

**Stripe Integration:**
- Elements/CardElement for secure input
- Payment Intent creation & confirmation
- Webhook handling for payment status
- Order created only after successful payment

**Address Management:**
- Save multiple addresses (authenticated users)
- Set default address
- Quick edit/delete
- Pre-fill on checkout

**Order Tracking:**
- Order number generation
- Tracking number assignment (manual)
- Carrier selection
- Email notifications (EmailJS)

### 3. Admin Features

**Dashboard:**
- Quick stats (total artworks, available, sold)
- 3D model gallery (compressed GLB files from Cloudinary)
- Navigation tabs for different sections

**Artwork Management:**
- Full CRUD operations
- Assign to stores/exhibitions
- Upload/manage images
- Price & technical details editing
- Bulk operations via table

**Location Management:**
- Store locations (with coordinates)
- Exhibition periods with dates
- Map visualization (Leaflet)
- URL links to store/exhibition pages

**Order Management:**
- List all orders (paginated, filterable)
- Update order status
- View payment history
- Track shipments
- Email notifications

**Analytics:**
- Sales by location (map heatmap)
- Revenue charts (Recharts)
- Order status breakdown

### 4. 3D Model Integration

**Implementation:** React Three Fiber + Three.js

**Files:** Located in Cloudinary (GLB compressed format)

**Features:**
- Auto-rotation in idle state
- Scroll-based rotation (desktop only)
- Material adjustments (reduce plastic look)
- Orbit controls (disabled but available)
- Performance optimization:
  - Draco decompression
  - Pixel ratio limiting (max 2)
  - Disabled antialias
  - High-performance mode

**Usage:**
- Admin dashboard (3 models side-by-side)
- Artwork detail pages
- 3D gallery component

### 5. Image Handling (Cloudinary)

**Architecture:**
- All artwork images hosted on Cloudinary
- `ObraImage` component handles lazy-loading
- Responsive sizing with URL parameters
- Fallback SVG images

**Optimization:**
- CDN delivery
- Responsive URLs
- Caching strategies
- Error handling with fallbacks

---

## 6. PERFORMANCE & OPTIMIZATION

### Frontend Optimizations

**1. Code Splitting:**
```javascript
// Vite rollupOptions chunks:
{
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'radix-ui': [...all radix components...],
  'framer-motion': ['framer-motion'],
  'maps': ['leaflet', 'react-leaflet'],
  'charts': ['recharts'],
  'tanstack': ['@tanstack/react-query', '@tanstack/react-table']
}
```

**2. Image Optimization:**
- Cloudinary CDN for all artwork images
- Lazy loading with Intersection Observer
- Responsive sizing (srcset)
- WebP format support
- Progressive loading

**3. React Query Configuration:**
```typescript
staleTime: 30_000,        // 30s data freshness
gcTime: 5 * 60_000,       // 5min cache retention
retry: 1,                 // Single retry
refetchOnWindowFocus: false
```

**4. Component Optimization:**
- useMemo for expensive computations
- useCallback for event handlers
- React.lazy for page splitting
- Virtual scrolling in tables (optional)

**5. Animation Performance:**
- Framer Motion (GPU-accelerated)
- Disabled 3D model entry animation
- Scroll-based 3D rotation only on desktop
- Reduced animation framerate on mobile

### Backend Optimizations

**1. Database:**
- Connection pooling (10 max)
- Indexed queries
- Views for complex data
- Prepared statements

**2. API Response:**
- Pagination support (default 10, max 100)
- Sorting/filtering at database level
- Compression enabled
- JSON responses

**3. File Storage:**
- Static files served from `/uploads`
- CDN (Cloudinary) for images
- File upload size limits (1MB JSON body)

### Security Measures

**Frontend:**
- Firebase token-based authentication
- Protected routes (role-based)
- XSS prevention (React auto-escaping)
- Secure Stripe integration

**Backend:**
- Helmet.js headers
- Rate limiting (auth: 5/15min, general: 100/15min)
- CORS whitelist
- Input validation (Zod)
- SQL injection prevention
- Firebase token verification
- Custom admin claims

---

## 7. DATA MODELS & TYPES

### Core Domain Types

**Obra (Artwork):**
```typescript
{
  id_obra: number;
  autor: string;
  titulo: string;
  anio?: number;
  medidas?: string;
  tecnica?: string;
  precio_salida: number | string;
  estado_venta: EstadoVenta;
  ubicacion?: Ubicacion;
  numero_seguimiento?: string;
  comprador_nombre?: string;
  comprador_email?: string;
  fecha_compra?: string;
  // Relations
  id_tienda?: number;
  id_expo?: number;
}
```

**Tienda (Store):**
```typescript
{
  id_tienda: number;
  nombre: string;
  lat: number;
  lng: number;
  url_tienda?: string;
}
```

**Exposición:**
```typescript
{
  id_expo: number;
  nombre: string;
  lat: number;
  lng: number;
  fecha_inicio: string;  // YYYY-MM-DD
  fecha_fin: string;
  url_expo?: string;
}
```

**Reserva (Cart Entry):**
```typescript
{
  id_reserva: number;
  id_obra: number;
  id_user?: string;
  session_id: string;
  expires_at: Date;
  created_at: Date;
}
```

**Order:**
```typescript
{
  id_orden: number;
  order_number: string;
  id_user: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment_intent_id?: string;
  tracking_number?: string;
  created_at: Date;
}
```

**DireccionEnvio (Shipping Address):**
```typescript
{
  id_direccion: number;
  id_user: string;
  nombre_completo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigo_postal: string;
  es_predeterminada: boolean;
}
```

### Query/Mutation Keys

**Artworks:**
- `['obras', sortKey, sortDir, page, pageSize]`
- `['obra-primary-img', id_obra]`

**Cart:**
- `['reservas', 'my-cart']`
- `['reservas']` (invalidated on changes)

**Orders:**
- `['orders', email]`
- `['orders', 'all']` (admin)

**Stores & Exhibitions:**
- `['tiendas']`
- `['expos']`

---

## 8. ENVIRONMENT CONFIGURATION

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_TEMPLATE_PAYMENT=...
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=arte_user
DB_PASS=arte_pass
DB_NAME=arte_db
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_ADMIN_JSON=<path-to-serviceAccountKey.json>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 9. DEPLOYMENT ARCHITECTURE

**Frontend:** Vercel (Git integration)
- Auto-deploy on push to main
- Environment variables configured
- CDN + global edge network

**Backend:** Railway or Render
- Docker containerization
- Auto-deploy on git push
- MySQL database
- Environment variables

**Media Storage:** Cloudinary
- Image CDN
- 3D model storage (GLB files)
- Automatic optimization

---

## 10. TESTING & QUALITY

**Testing Framework:** Vitest

**Test Coverage:**
- Unit tests for hooks (useFormValidation)
- Component tests (UI components)
- API integration tests
- E2E testing (optional)

**Code Quality:**
- ESLint configuration (React hooks, React refresh)
- TypeScript strict mode
- Pre-commit hooks (via git)

---

## 11. NOTABLE ARCHITECTURAL DECISIONS

### 1. Session-based Cart (Not User-specific)
- Allows guest checkout
- No database requirements for anonymous users
- Session ID in localStorage
- Expires after 30 minutes

### 2. Reservation System
- Temporary holds on artwork
- Prevents double-selling
- Automatic cleanup of expired reservations

### 3. Firebase + Custom Auth
- Leverages Firebase Authentication
- Custom role system (email-based for now)
- No complex permission database needed

### 4. TanStack Query for Everything
- Centralized data management
- Automatic caching & synchronization
- Single source of truth

### 5. Separation of Concerns
- Pages → Components → Hooks → Context → API
- Services layer (obrasService, etc.)
- Repositories for database access
- Validation at service level (Zod)

### 6. CDN for Static Content
- All artwork images on Cloudinary
- 3D models on Cloudinary
- Static assets in `/public`

### 7. Admin/User Split
- Separate navigation (AdminNav vs PillNav)
- Role-based route protection
- Different feature sets per role

---

## 12. INTEGRATION POINTS

### External Services

**1. Firebase:**
- Authentication (login, register, Google OAuth)
- Admin SDK for token verification

**2. Stripe:**
- Payment processing
- Webhook notifications
- Payment Intent API

**3. Cloudinary:**
- Image storage & optimization
- 3D model hosting
- URL-based transformations

**4. EmailJS:**
- Order confirmation emails
- Shipment notifications
- Delivery confirmations
- Thank you emails

**5. Leaflet/Maps:**
- Store locations
- Exhibition locations
- Geographic heatmaps

---

## 13. FILE SIZE & METRICS

**Frontend Code:**
- Total: ~14,800 lines of TypeScript/JSX
- 74 components
- 9 pages
- 16 custom hooks
- 7 query hooks

**Backend Code:**
- 7 services
- 7 repositories
- 8 controllers
- 3 route files

**Bundle Size (Estimated):**
- React vendor: ~45KB
- Radix UI: ~30KB
- Framer Motion: ~40KB
- Charts: ~35KB
- TanStack: ~25KB
- Application: ~50KB
- **Total (gzipped): ~225KB**

---

## 14. DEVELOPMENT WORKFLOW

**Commands:**

Frontend:
```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Build preview
npm run lint         # ESLint check
npm run test         # Vitest
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report
```

Backend:
```bash
npm run dev          # ts-node development
npm run build        # TypeScript compilation
npm run start        # Node production
npm run test         # Vitest tests
```

---

## 15. GIT WORKFLOW

**Main Branch:** main (production)
**Development Branch:** develop (staging)
**Feature Branches:** feature/feature-name

**Recent Commits:**
- Move PNG images to Cloudinary
- Establish Framer Motion usage
- Mobile adjustments for pieces
- Smooth & coherent animations
- Remove 3D model entry animation (performance)

---

## CONCLUSION

This is a sophisticated e-commerce platform with:
- Modern React architecture with TypeScript
- Robust backend with Express & MySQL
- Professional UI with Shadcn/Radix
- 3D model integration
- Complete payment processing
- Admin dashboard
- Analytics & tracking
- Performance optimizations
- Security best practices

The architecture follows clean code principles with clear separation of concerns, making it maintainable and scalable.

