# Art Gallery - Architecture Quick Reference

## Project Overview
- **Type:** Full-stack E-commerce platform
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **Backend:** Express.js + MySQL + Firebase Auth
- **Size:** ~14,800 lines (frontend), ~50 services (backend)
- **Tech Stack:** 35+ npm packages (frontend), 10+ (backend)

---

## Directory Structure at a Glance

```
Sprint-8-art-gallery/
├── src/                    # React Frontend
│   ├── components/         # 74 reusable components
│   ├── pages/             # 9 page components
│   ├── hooks/             # 16 custom hooks
│   ├── context/           # Auth & Cart providers
│   ├── query/             # TanStack Query hooks
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helpers & utilities
├── api/                   # Express Backend
│   └── src/
│       ├── controllers/   # 8 request handlers
│       ├── services/      # 7 business logic layers
│       ├── repositories/  # 7 database access layers
│       ├── routes/        # API endpoints
│       └── middleware/    # Auth, errors, security
└── public/               # Static assets
```

---

## Technology Stack Summary

### Frontend Core
| Purpose | Technology | Version |
|---------|-----------|---------|
| Framework | React | 19.1.1 | 
| Build Tool | Vite | 7.1.7 |
| Language | TypeScript | 5.8.3 |
| Styling | TailwindCSS | 4.1.13 |
| Routing | React Router | 7.9.3 |

### State Management & Data
| Purpose | Technology | Version |
|---------|-----------|---------|
| Server State | React Query | 5.90.2 |
| Client State | Context API | Built-in |
| Forms | React Hook Form | 7.63.0 |
| Table State | React Table | 8.21.3 |
| Validation | Zod | 4.1.11 |

### UI & Components
| Purpose | Technology | Version |
|---------|-----------|---------|
| Component Library | Shadcn/UI + Radix | Latest |
| Icons | Lucide React | 0.544.0 |
| Notifications | Sonner | 2.0.7 |
| Theme Toggle | Next Themes | 0.4.6 |

### Advanced Features
| Purpose | Technology | Version |
|---------|-----------|---------|
| 3D Graphics | Three.js | 0.180.0 |
| 3D React | React Three Fiber | 9.4.0 |
| 3D Utils | React Three Drei | 10.7.6 |
| Animations | Framer Motion | 12.23.24 |
| Maps | Leaflet + React Leaflet | 1.9.4 |
| Charts | Recharts | 2.15.4 |

### External Services
| Service | Technology | Purpose |
|---------|-----------|---------|
| Authentication | Firebase | User auth & authorization |
| Payments | Stripe | Credit card processing |
| Media CDN | Cloudinary | Image & 3D model hosting |
| Email | EmailJS | Order notifications |

### Backend Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Server | Express | 5.1.0 |
| Database | MySQL | 3.15.1 |
| Security | Helmet + Rate Limiter | Latest |
| Validation | Zod | 4.1.11 |
| Authentication | Firebase Admin | 13.5.0 |
| File Upload | Multer | 2.0.2 |
| Payments | Stripe | 19.1.0 |
| Image CDN | Cloudinary | 2.7.0 |

---

## Key Architectural Patterns

### 1. Data Flow Architecture
```
Component → Hook (useQuery/useAuth) → Service → API Client → Backend → Repository → Database
```

### 2. State Management Layers
```
Client State (Context)    → Auth, Cart
Server State (TanStack)   → Artworks, Orders, Images, etc.
Form State (React Hook Form) → Forms, Checkouts
```

### 3. Component Hierarchy
```
App
├── AuthProvider (Firebase auth context)
├── CartProvider (Shopping cart context)
├── BrowserRouter (React Router)
└── AppRoutes
    ├── PublicLayout (for user pages)
    └── AdminLayout (for admin pages)
```

### 4. API Architecture (Backend)
```
Client Request
    ↓
Express Middleware (auth, rate limit, cors)
    ↓
Controller (validates params)
    ↓
Service (business logic)
    ↓
Repository (database queries)
    ↓
MySQL Database
```

---

## API Endpoints by Resource

### Artworks (GET /obras, POST /obras, etc.)
- List: `GET /obras` (pageable, sortable)
- Create: `POST /obras` (admin)
- Update: `PUT /obras/:id` (admin)
- Delete: `DELETE /obras/:id` (admin)
- Assign Store: `POST /obras/:id/asignar-tienda` (admin)
- Assign Exhibition: `POST /obras/:id/asignar-expo` (admin)

### Images (GET /obras/:id/imagenes)
- List: `GET /obras/:id/imagenes`
- Upload: `POST /obras/:id/imagenes` (admin, multipart)
- Delete: `DELETE /imagenes/:id` (admin)

### Cart/Reservations (POST /reservas/add)
- Add: `POST /reservas/add`
- Remove: `DELETE /reservas/remove/:id_obra`
- Get: `GET /reservas/my-cart`
- Validate: `POST /reservas/validate`
- Clear: `DELETE /reservas/release-all`

### Orders (POST /orders, GET /orders/my-orders)
- Create: `POST /orders` (authenticated)
- My Orders: `GET /orders/my-orders` (authenticated)
- All Orders: `GET /orders/all` (admin)
- Update Status: `PUT /orders/:id/status` (admin)
- Cancel: `POST /orders/:id/cancel` (authenticated)

### Payments (POST /payments/create-payment-intent)
- Create Intent: `POST /payments/create-payment-intent`
- Confirm: `POST /payments/confirm`
- Webhook: `POST /payments/webhook`

### Addresses (GET /direcciones)
- List: `GET /direcciones` (authenticated)
- Create: `POST /direcciones` (authenticated)
- Update: `PUT /direcciones/:id` (authenticated)
- Delete: `DELETE /direcciones/:id` (authenticated)

### Stores & Exhibitions
- GET `/tiendas` → List stores
- GET `/expos` → List exhibitions
- CRUD operations available for admin

---

## Page Routes

### Public Routes
- `/` - Home page
- `/login` - Authentication
- `/shop` - Product catalog
- `/cart` - Shopping cart
- `/obra/:id` - Artwork detail
- `/my-orders` - User's orders

### Protected Routes
- `/checkout` - Payment (authenticated)
- `/dashboard` - Admin dashboard (admin only)

---

## State Management Reference

### Auth Context
```typescript
useAuth() → {
  user: { uid, email, name, role },
  isAuthenticated: boolean,
  login(), register(), logout(), loginWithGoogle()
}
```

### Cart Context
```typescript
useCart() → {
  items: CartItem[],
  addToCart(obra), removeFromCart(id),
  totalPrice: number, totalItems: number
}
```

### React Query Hooks
```typescript
useObras()         → List artworks
useOrders(email)   → User's orders
useTiendas()       → Stores
useExpos()         → Exhibitions
usePrimaryImage()  → Artwork primary image
```

---

## Component Map

### Layout Components
- `PublicLayout` - Main layout wrapper
- `AdminNav` - Admin navigation with tabs
- `PillNav` - User navigation bar
- `LogoLoop` - Animated logo
- `Footer` - Footer section

### Feature Components
- **Shop:** `ObraCard` (product card)
- **Detail:** `ObraImageGallery`, `ObraInfo`, `ObraActions`
- **Cart:** `CartItem` (line item)
- **Checkout:** `PaymentForm`, `AddressSelector`, `ShippingForm`
- **Orders:** `OrdersTable`, `OrderDetailModal`
- **Admin:** `ObrasTable`, `ObraFormCreate`, `LocationsMap`
- **3D:** `Model3D`, `Model3DGallery`

### UI Components (20+ Shadcn/Radix)
- Buttons, Cards, Dialogs, Forms, Tables
- Select, Dropdown, Accordion, Pagination
- DatePicker, Combobox, Popover, ScrollArea
- Alerts, Badges, Separators, Switches

---

## Database Schema (Key Tables)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `obras` | Artwork metadata | id_obra, autor, titulo, precio_salida, estado_venta |
| `obras_imagenes` | Artwork images | id, id_obra, url |
| `tiendas` | Physical stores | id_tienda, nombre, lat, lng |
| `expos` | Exhibitions | id_expo, nombre, fecha_inicio, fecha_fin |
| `reservas` | Shopping cart | id_reserva, id_obra, session_id, expires_at |
| `ordenes` | Orders/purchases | id_orden, id_user, total, status |
| `direcciones` | Shipping addresses | id_direccion, id_user, ciudad, estado |

---

## Performance Optimizations

### Frontend
✓ Code splitting (6 chunks: React, Radix, Framer, Maps, Charts, TanStack)
✓ Cloudinary CDN for images (optimized, responsive)
✓ Lazy loading images (Intersection Observer)
✓ 3D model optimization (Draco, dpr limit 2)
✓ React Query caching (30s stale, 5m gc)
✓ Scroll-based 3D rotation (desktop only)
✓ Disabled entry animations for models

### Backend
✓ Connection pooling (10 max)
✓ Pagination (default 10, max 100)
✓ Database views for complex queries
✓ Rate limiting (100/15min general, 5/15min auth)
✓ Gzip compression
✓ Prepared statements (SQL injection prevention)

---

## Security Implementation

### Frontend
- Firebase token-based auth
- Role-based protected routes
- React XSS auto-escaping
- Secure Stripe Elements

### Backend
- Helmet.js CSP headers
- Rate limiting middleware
- CORS whitelist (no wildcards)
- Zod input validation
- Firebase token verification
- SQL injection prevention

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL                    (default: /api)
VITE_STRIPE_PUBLIC_KEY         (Stripe)
VITE_FIREBASE_*                (Firebase config)
VITE_EMAILJS_*                 (EmailJS config)
```

### Backend (.env)
```
NODE_ENV, PORT, DB_*, FRONTEND_URL
STRIPE_*, FIREBASE_*, CLOUDINARY_*
```

---

## Deployment Platforms

| Component | Platform | Features |
|-----------|----------|----------|
| Frontend | Vercel | Auto-deploy, Git integration, CDN |
| Backend | Railway/Render | Docker, Auto-deploy, MySQL |
| Media | Cloudinary | CDN, Optimization, 3D storage |

---

## Development Commands

### Frontend
```bash
npm run dev              # Start dev server (port 5173)
npm run build           # Production build
npm run preview         # Preview build
npm run lint            # ESLint check
npm run test            # Run tests (Vitest)
npm run test:ui         # Vitest UI
```

### Backend
```bash
npm run dev             # ts-node development
npm run build           # TypeScript compilation
npm run start           # Node production
npm run test            # Vitest tests
```

---

## Key Features Summary

| Feature | Implementation | Status |
|---------|----------------|--------|
| E-commerce catalog | React components + TanStack Query | Complete |
| Shopping cart | Session-based reservations | Complete |
| Checkout flow | Stripe Elements integration | Complete |
| User authentication | Firebase Auth (email, Google) | Complete |
| Admin dashboard | Multi-tab interface with charts | Complete |
| Artwork management | CRUD + image upload + location | Complete |
| Order tracking | Status updates + emails | Complete |
| 3D models | Three.js + React Three Fiber | Complete |
| Analytics | Recharts + heatmaps | Complete |
| Dark mode | Next Themes | Complete |
| Mobile responsive | TailwindCSS breakpoints | Complete |

---
}

## Testing

- **Framework:** Vitest
- **Coverage:** Unit tests for hooks, components, API
- **UI Testing:** Testing Library (React)
- **Mocking:** Jest DOM utilities

---

## Documentation Structure

1. **COMPREHENSIVE_ARCHITECTURE.md** (This is detailed)
   - Full analysis of all systems
   - Data models and types
   - Integration points
   - Metrics and file sizes

2. **ARCHITECTURE_QUICK_REFERENCE.md** (This file)
   - Quick lookup guide
   - API endpoints
   - Tech stack table
   - Component map

3. **Existing docs**
   - ARQUITECTURA-PROYECTO.md (Spanish)
   - DEPLOYMENT.md (Deployment guide)
   - SECURITY.md (Security details)
   - CLOUDINARY_SETUP.md (Media setup)
   - ENV_CONFIG.md (Environment setup)

---

## Common Development Tasks

### Add a New Page
1. Create component in `/src/pages/`
2. Add route to `/src/routes/index.tsx`
3. Create necessary components in `/src/components/`
4. Use hooks for data fetching

### Add Admin Feature
1. Create component in `/src/components/[Feature]/`
2. Add mutation hook if needed
3. Create API endpoint in `/api/src/routes/`
4. Add controller, service, repository
5. Add navigation item to `AdminNav`

### Create API Endpoint
1. Create controller method in `/api/src/controllers/`
2. Create service in `/api/src/services/` (validation, logic)
3. Create repository in `/api/src/repositories/` (DB access)
4. Add route in `/api/src/routes/index.ts`
5. Create/update query hook in `/src/query/`

---

## File Locations for Quick Reference

| What | Where |
|------|-------|
| Add new API endpoint | `/api/src/routes/index.ts` |
| Add new page | `/src/pages/` |
| Add new component | `/src/components/[Category]/` |
| Add new hook | `/src/hooks/` |
| Add new query | `/src/query/` |
| Edit types | `/src/types/` |
| Configure auth | `/src/config/firebase.ts` |
| Configure payments | `/src/config/stripe.ts` |
| Configure API | `/src/api/client.ts` |
| Edit database | `/api/src/db/` or `/api/src/repositories/` |

---

## Version Control

- **Main Branch:** main (production)
- **Dev Branch:** develop (staging)
- **Feature Branches:** feature/* (development)

---

End of Quick Reference
