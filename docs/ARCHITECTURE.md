# P_I_E_D_R_A Art Gallery - Arquitectura de la Aplicación

## 📊 Diagrama General de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APLICACIÓN PRINCIPAL                         │
│                            App.tsx + Routes                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐              ┌──────▼──────┐
        │   CONTEXTOS    │              │   LAYOUTS   │
        │   GLOBALES     │              │             │
        └───────┬────────┘              └──────┬──────┘
                │                               │
    ┌───────────┼───────────┐                  │
    │           │           │                  │
┌───▼────┐ ┌───▼────┐ ┌───▼────┐      ┌──────▼──────┐
│  Auth  │ │  Cart  │ │ Query  │      │PublicLayout │
│Context │ │Context │ │ Client │      │AdminLayout  │
└────────┘ └────────┘ └────────┘      └──────┬──────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        │                                           │
                ┌───────▼────────┐                          ┌───────▼────────┐
                │  PÁGINAS       │                          │  COMPONENTES   │
                │  PÚBLICAS      │                          │  COMPARTIDOS   │
                └───────┬────────┘                          └───────┬────────┘
                        │                                           │
        ┌───────────────┼───────────────┐                          │
        │               │               │                          │
┌───────▼───────┐ ┌────▼────┐  ┌──────▼──────┐           ┌────────▼────────┐
│ PublicHome    │ │ShopPage │  │ObraDetail   │           │ PillNav         │
│ - Welcome     │ │ - Cards │  │ - Gallery   │           │ LogoLoop        │
│ - Hero        │ │ - Slider│  │ - Actions   │           │ Footer          │
│ - Gallery     │ └─────────┘  │ - Info      │           │ MobileDock      │
└───────────────┘              └─────────────┘           └─────────────────┘
```

## 🏗️ Estructura de Componentes por Módulo

### 1. **PÁGINAS PRINCIPALES (Pages)**

```
┌────────────────────────────────────────────────────────────────┐
│                        FLUJO PÚBLICO                            │
└────────────────────────────────────────────────────────────────┘

PublicHome (/)
├── WelcomeSection
│   ├── LiquidEther (background)
│   ├── LayerControls (dev only)
│   └── 4 Animated Layers (SVG/PNG)
├── HeroSection
│   ├── Model3D (3D Stone)
│   ├── Shop Logos (3 tiendas)
│   └── BUY NOW Button (Magnet effect)
└── GallerySection
    ├── Gallery Info Text
    └── Obra Carousel (horizontal scroll)

ShopPage (/shop)
├── ObraCard (filtrado: tienda_online + disponible)
│   ├── ObraImage
│   ├── Obra Info
│   └── Add to Cart Button
└── Logo Loop (animated)

ObraDetailPage (/obra/:id)
├── ObraImageGallery
│   ├── Main Image (object-contain)
│   └── Thumbnails
├── ObraInfo
│   ├── Título, Autor, Año
│   ├── Técnica, Medidas
│   └── Precio
└── ObraActions
    ├── "Disponible para colecciones" (email link)
    └── "Agregar al carrito" (green button)

CartPage (/cart)
├── CartItem (cada obra)
│   ├── ObraImage
│   ├── Quantity controls
│   └── Remove button
└── Cart Summary
    ├── Subtotal, Envío
    └── "Iniciar sesión" Button (green)

CheckoutPage (/checkout)
├── Column 1: Shipping Info
│   ├── AddressSelector (si auth)
│   └── ShippingForm (si no auth)
├── Column 2: Payment + Summary
│   ├── PaymentForm (Stripe)
│   └── OrderSummary
│       └── "Confirmar Compra" (green button)
└── OrderSuccess (on complete)

MyOrdersPage (/my-orders)
└── OrderCard (lista de órdenes del usuario)
    ├── Order details
    ├── Status badge
    └── Items list

┌────────────────────────────────────────────────────────────────┐
│                        FLUJO ADMIN                              │
└────────────────────────────────────────────────────────────────┘

LoginPage (/login)
└── Firebase Auth Integration

DashboardPage (/dashboard) [Protected: admin]
└── HomeDashboard
    ├── Stats Overview
    └── Navigation to admin sections

Admin Sections [Protected: admin]
├── ObrasPage - Gestión de obras
│   ├── DataTable
│   ├── ObraFormCreate
│   └── Image upload (Cloudinary)
├── OrdersPage - Gestión de pedidos
│   ├── DataTable con filtros
│   ├── OrderDetailModal
│   └── Status update + Email notification
├── TiendasPage - Gestión de tiendas
│   └── CRUD operations
└── ExposPage - Gestión de exposiciones
    └── CRUD operations with dates
```

### 2. **CONTEXTOS Y STATE MANAGEMENT**

```
┌─────────────────────────────────────────────────────────────┐
│                    GLOBAL STATE LAYER                        │
└─────────────────────────────────────────────────────────────┘

AuthContextFirebase
├── Gestión de autenticación
├── User state (user, isAuthenticated, role)
├── login(), logout()
└── Firebase Integration

CartContext
├── Shopping cart state
├── items: CartItem[]
├── Functions:
│   ├── addToCart(obra)
│   ├── removeFromCart(id)
│   ├── updateQuantity(id, qty)
│   ├── clearCart()
│   └── totalPrice (computed)
└── LocalStorage persistence

React Query Client
├── Server state management
├── Data fetching & caching
├── Mutations con invalidación
└── Queries:
    ├── useObras()
    ├── useDirecciones()
    ├── useOrders()
    └── Custom hooks
```

### 3. **COMPONENTES COMPARTIDOS**

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED COMPONENTS                         │
└─────────────────────────────────────────────────────────────┘

Layout Components
├── PublicLayout
│   ├── LogoLoop (animated header)
│   ├── PillNav (navigation)
│   ├── <children>
│   ├── Footer
│   └── MobileDock (mobile navigation)
└── AdminNav
    └── Admin sidebar navigation

Navigation
├── PillNav
│   ├── Inicio, Tienda, Carrito
│   ├── Login/Logout
│   └── Admin link (if admin)
└── MobileDock (mobile only)
    ├── Home, Shop, Cart icons
    ├── My Orders (if auth)
    └── Admin/Login

Common Components
├── ObraImage
│   ├── Cloudinary integration
│   ├── Lazy loading
│   └── Fallback handling
├── ProtectedRoute
│   ├── Auth validation
│   └── Role-based access
└── Model3D
    ├── Three.js/R3F
    ├── Responsive positioning
    └── Auto-rotation

UI Components (shadcn/ui)
├── Button (variant: glass for green buttons)
├── Card, CardContent, CardHeader
├── Input, Select, Textarea
├── Dialog, Modal
├── Badge, Label
├── DataTable, Pagination
└── Toaster, Sonner (notifications)
```

### 4. **HOOKS PERSONALIZADOS**

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS                              │
└─────────────────────────────────────────────────────────────┘

Data Fetching (React Query)
├── useObras() - Fetch obras con filtros
├── useDirecciones() - User addresses
├── useOrders() - User orders
├── useCreateDireccion() - Mutation
├── useSetDefaultDireccion() - Mutation
└── useUpdateOrderStatus() - Mutation

Business Logic
├── useCheckoutForm()
│   ├── Form state management
│   ├── Address loading
│   └── Validation
├── useStripePayment()
│   ├── Payment processing
│   ├── Order creation
│   └── Cart clearing
├── useFormValidation()
│   ├── Field validation
│   └── Error messages
└── useIsInCart(obraId)
    └── Check if obra is in cart

UI/UX Hooks
├── useNotifications()
│   ├── toast.success()
│   ├── toast.error()
│   └── toast.info()
└── useObraImages()
    └── Fetch images for specific obra
```

### 5. **SERVICIOS Y API**

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                            │
└─────────────────────────────────────────────────────────────┘

API Services (Frontend)
├── obrasService
│   ├── getObras(filters, pagination)
│   ├── createObra(data)
│   ├── updateObra(id, data)
│   └── deleteObra(id)
├── imagenesService
│   ├── listByObra(obraId)
│   ├── uploadToCloudinary(file)
│   └── delete(imageId)
├── ordersService
│   ├── createOrder(orderData)
│   ├── getUserOrders()
│   └── updateOrderStatus(id, status, tracking)
└── direccionesService
    ├── getUserDirecciones()
    ├── createDireccion(data)
    └── setDefault(id)

External Services
├── Stripe
│   ├── Payment processing
│   └── Card validation
├── Cloudinary
│   ├── Image upload
│   └── Image optimization
├── EmailJS
│   ├── Shipment notifications
│   └── Order confirmations
└── Firebase Auth
    ├── Authentication
    └── User management

Backend API (Express)
├── /api/obras - CRUD operations
├── /api/orders - Order management
├── /api/direcciones - Address management
├── /api/tiendas - Store management
├── /api/expos - Exhibition management
└── /api/imagenes - Image management
```

## 🔄 Flujos de Datos Principales

### **FLUJO DE COMPRA**

```
1. User Browse
   PublicHome → ShopPage → ObraDetailPage

2. Add to Cart
   ObraActions → CartContext.addToCart() → API Reservas

3. View Cart
   CartPage → CartContext.items → Display items

4. Checkout
   CheckoutPage → AuthContext (check login)
   ├── Si NO auth: ShippingForm (guest checkout)
   └── Si auth: AddressSelector (saved addresses)

5. Payment
   PaymentForm (Stripe) → useStripePayment()
   ├── Validate card
   ├── Process payment
   └── Create order (API)

6. Order Creation
   Backend /payments/confirm
   ├── Save to database
   ├── Update obras status
   ├── Release reservations
   └── Return success

7. Email Notification
   EmailJS → Send confirmation to user

8. Show Success
   OrderSuccess component → Navigate to My Orders
```

---

## 📖 FLUJO DE COMPRA - ANÁLISIS DETALLADO

### **PASO 1: User Browse (Navegación y Exploración)**

#### **1.1 PublicHome (Página de Inicio)**
**Ubicación**: `src/pages/PublicHome.tsx`

**Propósito**: Primera página que ve el usuario, presenta la galería de arte de forma atractiva.

**Funcionamiento**:
```typescript
// Obtiene las últimas 15 obras ordenadas por ID descendente
const { data } = useObras({
  sort: { key: "id_obra", dir: "desc" },
  page: 1,
  pageSize: 15
});
```

**Secciones que componen la página**:
1. **WelcomeSection**: Animación de fondo líquido con capas SVG/PNG
2. **HeroSection**: Modelo 3D de piedra, logos de tiendas, botón BUY NOW
3. **GallerySection**: Carrusel horizontal de obras

**Flujo de datos**:
- `useObras()` hace petición GET a `/api/obras` con parámetros de paginación
- React Query cachea la respuesta para optimizar futuras visitas
- Las obras se pasan como props a `GallerySection`

---

#### **1.2 ShopPage (Catálogo de Tienda)**
**Ubicación**: `src/pages/ShopPage.tsx`

**Propósito**: Mostrar todas las obras disponibles para venta online en formato de catálogo deslizante.

**Filtrado de obras**:
```typescript
const availableObras = useMemo(() => {
  return obras.filter(
    (obra) => obra.estado_venta === "disponible" &&
              obra.ubicacion === "tienda_online"
  );
}, [obras]);
```

**Criterios de filtrado**:
- `estado_venta === "disponible"`: Solo obras que no han sido vendidas
- `ubicacion === "tienda_online"`: Solo obras habilitadas para venta online (excluye obras en almacén, exposición, etc.)

**Componentes utilizados**:
- **ObraCard**: Card de obra individual con imagen, info y botón "Agregar al carrito"
- **Scroll horizontal**: Diseño tipo slider con efecto snap
- **Logo Loop**: Animación de logos infinita en la parte inferior

**Interacciones del usuario**:
1. Scroll horizontal para ver más obras
2. Click en obra → `navigate(/obra/${id})` → Va a ObraDetailPage
3. Click en "Agregar al carrito" → Llama a `addToCart(obra)`

---

#### **1.3 ObraDetailPage (Detalle de Obra)**
**Ubicación**: `src/pages/ObraDetailPage.tsx`

**Propósito**: Mostrar toda la información de una obra específica, incluyendo galería de imágenes, detalles técnicos y opciones de compra.

**Obtención de datos**:
```typescript
const { id } = useParams(); // ID de la obra desde la URL
const { data } = useObras({ pageSize: 1000 }); // Obtiene todas las obras
const obra = data?.data.find((o) => o.id_obra === Number(id));

// Obtiene imágenes adicionales de la obra
const [images, setImages] = useState<ObraImagen[]>([]);
useEffect(() => {
  imagenesService.listByObra(Number(id))
    .then((imgs) => setImages(imgs));
}, [id]);
```

**Lógica de disponibilidad**:
```typescript
const isAvailable = obra.estado_venta === "disponible";
const isInExhibition = obra.ubicacion === "exposicion";
const canPurchase = isAvailable &&
                   obra.ubicacion === "tienda_online" &&
                   !isInCart;
```

**Componentes principales**:
1. **ObraImageGallery**:
   - Muestra imagen principal (object-contain para no recortar)
   - Thumbnails para navegar entre múltiples imágenes
   - Integración con Cloudinary

2. **ObraInfo**:
   - Título, autor, año
   - Técnica, medidas
   - Descripción (si existe)

3. **ObraActions**:
   - Si obra en exposición: Botón "Disponible para colecciones" (mailto link)
   - Si obra disponible: Precio + Botón "Agregar al carrito"
   - Si ya está en carrito: Botón "Ver carrito"

---

### **PASO 2: Add to Cart (Agregar al Carrito)**

#### **2.1 ObraActions Component**
**Ubicación**: `src/components/Obra/ObraActions.tsx`

**Manejo de casos especiales**:

**Caso 1: Obra en Exposición**
```typescript
if (isInExhibition) {
  return (
    <a href="mailto:jesus.velazquez.bau500@gmail.com?subject=Consulta sobre obra en exposición">
      <Button>Disponible para colecciones</Button>
    </a>
  );
}
```
- No se puede comprar directamente
- Link de contacto vía email para consultas sobre colecciones

**Caso 2: Obra Disponible**
```typescript
<Button
  onClick={onAddToCart}
  disabled={!canPurchase || isInCart}
>
  {isInCart ? "En el carrito" : "Agregar al carrito"}
</Button>
```

**Caso 3: Obra Ya en Carrito**
```typescript
{isInCart && (
  <Button onClick={() => navigate("/cart")}>
    Ver carrito
  </Button>
)}
```

---

#### **2.2 CartContext - Sistema de Reservas**
**Ubicación**: `src/context/CartContext.tsx`

**Arquitectura del carrito**:
El carrito NO usa localStorage, sino un **sistema de reservas en el backend** con session ID.

**Flujo de addToCart**:
```typescript
const addToCart = async (obra: Obra) => {
  try {
    // 1. Llamar al hook de mutación
    await addMutation.mutateAsync(obra.id_obra);

    // 2. Mostrar notificación de éxito
    toast.success(`${obra.titulo} agregado al carrito`);
  } catch (error: any) {
    // 3. Manejar errores (obra no disponible, ya reservada, etc.)
    const message = error.response?.data?.message || "Error al agregar";
    toast.error(message);
    throw error;
  }
};
```

**useAddToCart Hook** (`src/hooks/useReservas.ts`):
```typescript
export function useAddToCart() {
  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getOrCreateSessionId(); // UUID único por sesión
      const data = await apiClient.post(
        "/reservas/add",
        { id_obra },
        { "x-session-id": sessionId } // Header para identificar sesión
      );
      return data.data;
    },
    onSuccess: () => {
      // Invalidar queries para refrescar el carrito
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}
```

**Session ID** (`src/utils/session.ts`):
- Se genera un UUID único por navegador
- Se almacena en localStorage como `session_id`
- Se envía en cada petición de reservas
- Permite tener carrito persistente sin autenticación
- Se limpia al completar compra o liberar reservas

**Backend - Sistema de Reservas**:
- Cuando se agrega una obra, se crea una entrada en tabla `reservas`
- Reserva tiene duración de 15 minutos
- Durante ese tiempo, la obra no puede ser comprada por otro usuario
- Si el tiempo expira, la reserva se libera automáticamente

**Construcción de items del carrito**:
```typescript
const items = useMemo<CartItem[]>(() => {
  return reservas
    .map((reserva) => {
      const obra = obras.find((o) => o.id_obra === reserva.id_obra);
      if (!obra) return null;

      return {
        obra,
        quantity: 1, // Las obras son únicas, siempre cantidad 1
        reserva,
      };
    })
    .filter((item): item is CartItem => item !== null);
}, [reservas, obras]);
```

**Datos proporcionados por CartContext**:
- `items`: Array de obras con sus reservas
- `totalItems`: Número de obras en carrito
- `totalPrice`: Suma de precios de todas las obras
- `addToCart()`: Función para agregar obra
- `removeFromCart()`: Función para quitar obra
- `clearCart()`: Liberar todas las reservas
- `isLoading`: Estado de carga

---

### **PASO 3: View Cart (Visualizar Carrito)**

#### **3.1 CartPage**
**Ubicación**: `src/pages/CartPage.tsx`

**Obtención de datos**:
```typescript
const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
const { isAuthenticated } = useAuth();
```

**Caso 1: Carrito Vacío**
```typescript
if (items.length === 0) {
  return (
    <div>
      <ShoppingBag icon />
      <h2>Tu carrito está vacío</h2>
      <Button onClick={() => navigate("/shop")}>
        Explorar la colección
      </Button>
    </div>
  );
}
```

**Caso 2: Carrito Con Items**

**Layout de 2 columnas**:
1. **Columna izquierda**: Lista de items
   - Header con título y botón "Vaciar carrito"
   - CartItem components (uno por obra)

2. **Columna derecha**: Resumen (sticky)
   - Subtotal
   - Envío (gratis)
   - Total
   - Botón de acción: "Iniciar sesión" o "Proceder al pago"

**CartItem Component** (`src/components/Cart/CartItem.tsx`):
- Imagen de la obra (ObraImage component)
- Información: título, técnica, año
- Precio unitario
- Botón para remover del carrito
- NO tiene selector de cantidad (las obras son únicas)

**Flujo de checkout**:
```typescript
const handleCheckout = () => {
  if (!isAuthenticated) {
    navigate("/login"); // Redirigir a login si no autenticado
    return;
  }
  navigate("/checkout"); // Ir directamente a checkout si autenticado
};
```

**Nota importante**: Los usuarios NO autenticados pueden ver el carrito pero deben iniciar sesión antes de proceder al pago.

---

### **PASO 4: Checkout (Proceso de Pago)**

#### **4.1 CheckoutPage - Layout y Coordinación**
**Ubicación**: `src/pages/CheckoutPage.tsx`

**Estructura del componente**:
```typescript
export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>  {/* Wrapper de Stripe */}
      <CheckoutForm />
    </Elements>
  );
}
```

**CheckoutForm - Componente Principal**:

**Hooks utilizados**:
```typescript
const { items } = useCart(); // Items del carrito
const { user } = useAuth(); // Usuario autenticado
const { formData, selectedAddressId, handleChange, loadAddressData } = useCheckoutForm();
const { processPayment, isProcessing, orderComplete, canProcess } = useStripePayment();
```

**Layout de 2 columnas (50%-50%)**:

**Columna Izquierda - Información de Envío**:
- Si usuario autenticado: `<AddressSelector />` (direcciones guardadas)
- Si usuario NO autenticado: `<ShippingForm />` (formulario completo)

**Columna Derecha - Pago y Resumen**:
- `<PaymentForm />` (Stripe card element)
- `<OrderSummary />` (resumen de compra y botón confirmar)

**Manejo del formulario**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!canProcess) return; // Verificar que Stripe esté listo

  try {
    await processPayment(formData); // Procesar pago
    toast.success("¡Compra realizada con éxito!");
  } catch (error: any) {
    toast.error(error.message || "Error al procesar el pago");
  }
};
```

**Guardias de navegación**:
```typescript
// Redirigir si carrito vacío
if (items.length === 0 && !orderComplete) {
  navigate("/cart");
  return null;
}

// Mostrar pantalla de éxito si orden completada
if (orderComplete) {
  return <OrderSuccess />;
}
```

---

#### **4.2 useCheckoutForm - Gestión del Formulario**
**Ubicación**: `src/hooks/useCheckoutForm.ts`

**Estado del formulario**:
```typescript
const [formData, setFormData] = useState<CheckoutFormData>({
  email: user?.email || "",
  nombre: user?.name || "",
  telefono: "",
  direccion: "",
  numeroExterior: "",
  numeroInterior: "",
  colonia: "",
  codigoPostal: "",
  ciudad: "",
  estado: "",
  pais: "México", // Fijo, solo se envía a México
  referencias: "",
});
```

**Carga de dirección guardada**:
```typescript
const loadAddressData = (direccion: DireccionEnvio) => {
  setSelectedAddressId(direccion.id_direccion);
  setFormData({
    email: direccion.email || user?.email || "",
    nombre: direccion.nombre_completo,
    telefono: direccion.telefono,
    direccion: direccion.direccion,
    numeroExterior: direccion.numero_exterior,
    numeroInterior: direccion.numero_interior || "",
    colonia: direccion.colonia,
    codigoPostal: direccion.codigo_postal,
    ciudad: direccion.ciudad,
    estado: direccion.estado,
    pais: direccion.pais,
    referencias: direccion.referencias || "",
  });
};
```

---

#### **4.3 ShippingForm - Formulario de Envío**
**Ubicación**: `src/components/Checkout/ShippingForm.tsx`

**Campos del formulario**:
1. **Email** (requerido, type="email")
2. **Nombre completo** (requerido)
3. **Teléfono** (requerido, type="tel")
4. **Calle** (requerido)
5. **Número Exterior** (requerido)
6. **Número Interior** (opcional)
7. **Código Postal** (requerido, 5 dígitos)
8. **Colonia** (requerido)
9. **Ciudad** (requerido)
10. **Estado** (requerido, select con 32 estados de México)
11. **País** (fijo: "México", disabled)
12. **Referencias de entrega** (opcional, textarea)

**Validación en tiempo real**:
```typescript
const { errors, validateField } = useFormValidation();

const handleBlur = (name: keyof CheckoutFormData) => (e) => {
  validateField(name, e.target.value);
};

const handleChangeWithValidation = (e) => {
  onChange(e);
  // Validar solo si ya hay un error previo
  if (errors[e.target.name]) {
    validateField(e.target.name, e.target.value);
  }
};
```

**Estados de México**:
```typescript
const ESTADOS_MEXICO = [
  "Aguascalientes", "Baja California", "Baja California Sur",
  "Campeche", "Chiapas", "Chihuahua", "Ciudad de México",
  "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
  "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos",
  "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro",
  "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
  "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán",
  "Zacatecas"
];
```

---

#### **4.4 AddressSelector - Direcciones Guardadas**
**Ubicación**: `src/components/Checkout/AddressSelector.tsx`

**Solo para usuarios autenticados**. Permite:
1. Seleccionar dirección guardada (radio buttons)
2. Ver dirección marcada como predeterminada
3. Agregar nueva dirección
4. Guardar nueva dirección para futuras compras

**Obtención de direcciones**:
```typescript
const { data: direcciones = [], isLoading } = useDirecciones();
const createDireccion = useCreateDireccion();
const setDefault = useSetDefaultDireccion();
```

**Estados de vista**:

**Estado 1: Sin direcciones guardadas**
- Muestra directamente `<ShippingForm />`

**Estado 2: Con direcciones guardadas**
- Muestra lista de direcciones con radio buttons
- Cada dirección muestra: nombre, dirección completa, teléfono
- Badge si es predeterminada
- Botón "Nueva dirección" para agregar más

**Estado 3: Agregando nueva dirección**
- Muestra `<ShippingForm />`
- Checkbox para "Guardar esta dirección para futuras compras"
- Botón para volver a ver direcciones guardadas

**Selección de dirección**:
```typescript
const handleSelectAddress = (direccionId: number) => {
  const direccion = direcciones.find((d) => d.id_direccion === direccionId);
  if (direccion) {
    setSelectedId(direccionId);
    setShowNewForm(false);
    onSelectAddress(direccion); // Carga datos en formData
  }
};
```

**Guardar nueva dirección** (opcional):
```typescript
const handleSaveNewAddress = async () => {
  if (!saveNewAddress) return;

  try {
    await createDireccion.mutateAsync({
      nombre_completo: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion,
      // ... resto de campos
    });
    notifications.success("Dirección guardada");
  } catch (error) {
    notifications.error("Error al guardar");
  }
};
```

---

### **PASO 5: Payment (Procesamiento de Pago)**

#### **5.1 PaymentForm - Formulario de Tarjeta**
**Ubicación**: `src/components/Checkout/PaymentForm.tsx`

**Integración con Stripe**:
```typescript
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "hsl(var(--foreground))",
      fontFamily: 'system-ui, -apple-system, sans-serif',
      "::placeholder": {
        color: "hsl(var(--muted-foreground))",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
```

**CardElement de Stripe**:
- Componente seguro de Stripe que maneja:
  - Número de tarjeta
  - Fecha de expiración
  - CVV
  - Validación en tiempo real
  - Detección de marca de tarjeta (Visa, Mastercard, Amex, etc.)

**Estados del componente**:
```typescript
const [cardComplete, setCardComplete] = useState(false);
const [cardError, setCardError] = useState<string | null>(null);
const [cardBrand, setCardBrand] = useState<string>("");

const handleCardChange = (event: any) => {
  setCardError(event.error ? event.error.message : null);
  setCardComplete(event.complete);
  setCardBrand(event.brand || "");
};
```

**Indicadores visuales**:
- ✅ "Tarjeta válida" cuando `cardComplete === true`
- ❌ Mensaje de error si hay problemas de validación
- 💳 Muestra marca de tarjeta detectada (Visa, Mastercard, etc.)

**Modo test**:
- Muestra banner azul con tarjeta de prueba: 4242 4242 4242 4242
- Lista adicional de tarjetas de prueba para diferentes casos

---

#### **5.2 useStripePayment - Lógica de Pago**
**Ubicación**: `src/hooks/useStripePayment.ts`

**Este es el hook más crítico del flujo de compra.**

**Hooks y estado utilizados**:
```typescript
const stripe = useStripe(); // Cliente de Stripe
const elements = useElements(); // Elementos de Stripe (CardElement)
const { items, totalPrice, clearCart } = useCart();
const { user } = useAuth();
const [isProcessing, setIsProcessing] = useState(false);
const [orderComplete, setOrderComplete] = useState(false);
```

**Función processPayment - 4 Pasos Principales**:

**PASO 5.2.1: Crear Payment Intent en Backend**
```typescript
const paymentData = await api.post("/payments/create-payment-intent", {
  items: items.map((item) => ({
    id_obra: item.obra.id_obra,
    titulo: item.obra.titulo,
    precio: item.obra.precio_salida,
  })),
});

// Respuesta del backend:
// {
//   clientSecret: "pi_xxx_secret_xxx",
//   paymentIntentId: "pi_xxx",
//   amount: 50000 (en centavos)
// }
```

**Backend - /payments/create-payment-intent**:
- Calcula el total de la compra
- Valida que las obras sigan disponibles
- Crea Payment Intent en Stripe
- Retorna clientSecret para confirmar el pago en frontend

**PASO 5.2.2: Confirmar Pago con Stripe**
```typescript
const cardElement = elements.getElement(CardElement);

const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
  paymentData.clientSecret,
  {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: formData.nombre,
        address: {
          line1: formData.direccion,
          city: formData.ciudad,
          postal_code: formData.codigoPostal,
        },
        phone: formData.telefono,
      },
    },
  }
);

if (stripeError) {
  throw new Error(stripeError.message);
}
```

**Lo que sucede en Stripe**:
1. Procesa la tarjeta con los datos proporcionados
2. Valida fondos disponibles
3. Aplica verificaciones de seguridad (3D Secure si es necesario)
4. Retorna resultado: succeeded, requires_action, failed, etc.

**PASO 5.2.3: Confirmar en Backend y Crear Orden**
```typescript
if (paymentIntent?.status === "succeeded") {
  await api.post("/payments/confirm", {
    paymentIntentId: paymentData.paymentIntentId,
    obra_ids: items.map((item) => item.obra.id_obra),
    buyer_name: formData.nombre,
    buyer_email: user?.email || formData.email,
    shipping_data: {
      nombre_completo: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion,
      numero_exterior: formData.numeroExterior,
      numero_interior: formData.numeroInterior,
      colonia: formData.colonia,
      codigo_postal: formData.codigoPostal,
      ciudad: formData.ciudad,
      estado: formData.estado,
      pais: formData.pais,
      referencias: formData.referencias,
    },
  });
}
```

**Backend - /payments/confirm**:
1. Verificar que el Payment Intent realmente fue exitoso (doble verificación)
2. Crear registro de orden en base de datos
3. Actualizar estado de obras a "vendido"
4. Liberar todas las reservas de la sesión
5. Guardar información de envío
6. Retornar confirmación

**PASO 5.2.4: Enviar Email de Confirmación**
```typescript
if (user?.email) {
  try {
    await sendPaymentConfirmation({
      to_email: user.email,
      to_name: formData.nombre,
      order_id: paymentData.paymentIntentId,
      total_amount: totalPrice,
      items: items.map((item) => ({
        titulo: item.obra.titulo,
        precio: Number(item.obra.precio_salida) || 0,
      })),
    });
  } catch (emailError) {
    console.error("Error sending confirmation email:", emailError);
    // NO mostrar error al usuario, el pago fue exitoso
  }
}
```

**EmailJS - sendPaymentConfirmation** (`src/config/emailjs.ts`):
```typescript
export async function sendPaymentConfirmation(params) {
  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATES.PAYMENT_CONFIRMATION,
    {
      to_email: params.to_email,
      to_name: params.to_name,
      order_id: params.order_id,
      total_amount: params.total_amount.toFixed(2),
      items_list: params.items
        .map((item) => `${item.titulo} - $${item.precio.toFixed(2)}`)
        .join('\n'),
    }
  );
  return response;
}
```

**Finalización del proceso**:
```typescript
setOrderComplete(true); // Cambiar estado para mostrar OrderSuccess
clearCart(); // Liberar todas las reservas
return true;
```

---

### **PASO 6: Order Creation (Backend)**

**Endpoint**: `POST /api/payments/confirm`

**Operaciones en el backend**:

**6.1 Verificar Payment Intent**:
```javascript
const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
if (paymentIntent.status !== 'succeeded') {
  throw new Error('Payment not completed');
}
```

**6.2 Crear registro de orden**:
```sql
INSERT INTO orders (
  payment_intent_id,
  buyer_name,
  buyer_email,
  total_amount,
  status,
  created_at
) VALUES (?, ?, ?, ?, 'pendiente', NOW());
```

**6.3 Crear items de orden**:
```sql
INSERT INTO order_items (
  order_id,
  obra_id,
  price
) VALUES (?, ?, ?);
```

**6.4 Actualizar estado de obras**:
```sql
UPDATE obras
SET estado_venta = 'vendido',
    ubicacion = 'vendido'
WHERE id_obra IN (?);
```

**6.5 Guardar dirección de envío**:
```sql
INSERT INTO shipping_addresses (
  order_id,
  nombre_completo,
  telefono,
  email,
  direccion,
  numero_exterior,
  numero_interior,
  colonia,
  codigo_postal,
  ciudad,
  estado,
  pais,
  referencias
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

**6.6 Liberar reservas**:
```sql
DELETE FROM reservas
WHERE session_id = ?;
```

**6.7 Invalidar cache**:
- React Query en frontend automáticamente refresca queries de obras
- Esto actualiza disponibilidad en toda la aplicación

---

### **PASO 7: Email Notification (Confirmación)**

**Servicio**: EmailJS
**Template**: PAYMENT_CONFIRMATION

**Información enviada al usuario**:
- **Asunto**: "Confirmación de compra - P_I_E_D_R_A Art Gallery"
- **Destinatario**: Email del usuario autenticado o ingresado en checkout
- **Contenido**:
  - Nombre del comprador
  - Número de orden (Payment Intent ID)
  - Lista de obras compradas con precios
  - Total pagado
  - Mensaje de que recibirá actualización cuando se envíe el pedido

**Variables del template**:
```javascript
{
  to_email: "usuario@email.com",
  to_name: "Juan Pérez",
  order_id: "pi_3XxXxXxXxXxXxX",
  total_amount: "5000.00",
  items_list: "Obra 1 - $2500.00\nObra 2 - $2500.00"
}
```

**Configuración EmailJS**:
- Service ID configurado en variables de entorno
- Template ID específico para confirmación de pago
- Public Key para autenticación

**Manejo de errores**:
- Si falla el envío de email, NO se muestra error al usuario
- El pago ya fue procesado exitosamente
- Se registra el error en console para debugging
- El admin puede ver la orden y reenviar notificación manualmente

---

### **PASO 8: Order Success (Pantalla de Éxito)**

#### **OrderSuccess Component**
**Ubicación**: `src/components/Checkout/OrderSuccess.tsx`

**Elementos visuales**:
1. **Ícono de éxito**: CheckCircle animado (verde, 32x32)
2. **Título**: "¡Compra exitosa!" (degradado verde)
3. **Mensaje principal**: "Tu pedido ha sido procesado correctamente"
4. **Mensaje secundario**: "Recibirás un correo de confirmación en breve"
5. **Card informativa**: "Puedes seguir el estado de tu pedido en Mis Compras"
6. **Botones de navegación**:
   - "Ver mis compras" → `/my-orders`
   - "Volver al inicio" → `/`

**Animaciones**:
```typescript
className="animate-in fade-in zoom-in duration-500"
```

**Diseño del card**:
- Gradiente verde suave (from-green-50 to-emerald-50)
- Border verde
- Icono 💡
- Texto explicativo sobre seguimiento de pedido

**Acciones disponibles**:
```typescript
<Button onClick={() => navigate("/my-orders")}>
  📦 Ver mis compras
</Button>
<Button onClick={() => navigate("/")}>
  Volver al inicio
</Button>
```

---

## 🔄 DIAGRAMA DE SECUENCIA COMPLETO

```
Usuario                Frontend                 Backend                  Stripe              EmailJS
  │                      │                        │                        │                    │
  │──Browse obras──────>│                        │                        │                    │
  │                      │──GET /api/obras──────>│                        │                    │
  │                      │<──obras disponibles───│                        │                    │
  │                      │                        │                        │                    │
  │──Click "Agregar"──>│                        │                        │                    │
  │                      │──POST /reservas/add──>│                        │                    │
  │                      │   (session-id)        │                        │                    │
  │                      │<──reserva creada──────│                        │                    │
  │<─Toast "Agregado"──│                        │                        │                    │
  │                      │                        │                        │                    │
  │──Ver carrito──────>│                        │                        │                    │
  │                      │─GET /reservas/my-cart>│                        │                    │
  │                      │<──lista reservas──────│                        │                    │
  │<──Mostrar items────│                        │                        │                    │
  │                      │                        │                        │                    │
  │─Proceder al pago──>│                        │                        │                    │
  │                      │──Verificar auth──────>│                        │                    │
  │                      │<──user data───────────│                        │                    │
  │<─Mostrar checkout──│                        │                        │                    │
  │                      │                        │                        │                    │
  │─Llenar formulario─>│                        │                        │                    │
  │─Ingresar tarjeta──>│                        │                        │                    │
  │                      │──Validar CardElement─>│                        │                    │
  │<─Tarjeta válida────│                        │                        │                    │
  │                      │                        │                        │                    │
  │──Confirmar compra─>│                        │                        │                    │
  │                      │─POST /payments/       │                        │                    │
  │                      │  create-payment-intent>│                        │                    │
  │                      │                        │─stripe.paymentIntents.│                    │
  │                      │                        │  create()────────────>│                    │
  │                      │                        │<──clientSecret────────│                    │
  │                      │<──clientSecret────────│                        │                    │
  │                      │                        │                        │                    │
  │                      │─stripe.confirmCardPaym─────────────────────────>│                    │
  │                      │  (clientSecret, card) │                        │                    │
  │                      │                        │                   [Procesando]              │
  │                      │                        │                   [Validando]               │
  │                      │<──paymentIntent (succeeded)─────────────────────│                    │
  │                      │                        │                        │                    │
  │                      │─POST /payments/confirm>│                        │                    │
  │                      │  (paymentIntentId,     │                        │                    │
  │                      │   shipping_data)       │                        │                    │
  │                      │                        │──Verify payment──────>│                    │
  │                      │                        │<──confirmed───────────│                    │
  │                      │                        │──Create order (DB)    │                    │
  │                      │                        │──Update obras         │                    │
  │                      │                        │──Release reservas     │                    │
  │                      │<──order created───────│                        │                    │
  │                      │                        │                        │                    │
  │                      │──sendPaymentConfirmation──────────────────────────────────────────>│
  │                      │                        │                        │                    │
  │                      │                        │                        │        [Enviando email]
  │                      │<──email sent───────────────────────────────────────────────────────│
  │                      │                        │                        │                    │
  │                      │──clearCart()──────────>│                        │                    │
  │                      │──DELETE /reservas/    │                        │                    │
  │                      │   release-all          │                        │                    │
  │<─OrderSuccess──────│                        │                        │                    │
  │                      │                        │                        │                    │
  │                      │                        │                        │                 [Email]
  │<─Email confirmación─────────────────────────────────────────────────────────────────────────│
  │                      │                        │                        │                    │
```

---

## 🛡️ SEGURIDAD Y VALIDACIONES

### **Validaciones Frontend**:
1. **Formulario de envío**: Campos requeridos, formato de email, CP de 5 dígitos
2. **Tarjeta**: Stripe valida número, CVV, fecha en tiempo real
3. **Carrito**: Verifica que haya items antes de checkout
4. **Auth**: Verifica autenticación antes de permitir checkout

### **Validaciones Backend**:
1. **Disponibilidad**: Verifica que obras sigan disponibles antes de crear payment intent
2. **Reservas**: Valida que la sesión tenga reservas activas
3. **Payment Intent**: Doble verificación del estado en Stripe antes de crear orden
4. **Precios**: Calcula totales en backend, no confía en frontend
5. **Session ID**: Valida que sea un UUID válido

### **Manejo de Errores**:

**Errores de Stripe**:
- Tarjeta rechazada → Muestra mensaje de Stripe
- Fondos insuficientes → Muestra mensaje específico
- Requiere 3D Secure → Stripe maneja automáticamente

**Errores de Reservas**:
- Obra ya no disponible → Toast error, refresca carrito
- Reserva expirada → Remueve del carrito automáticamente
- Session ID inválido → Genera nuevo session ID

**Errores de Red**:
- Timeout → Muestra mensaje "Error de conexión"
- 500 Error → "Error del servidor, intenta más tarde"
- Reintentos automáticos con React Query

---

## ⏱️ TIMEOUTS Y TIEMPOS

### **Reservas**:
- Duración: 15 minutos
- Refetch del carrito: cada 30 segundos (para detectar expiraciones)
- Cleanup automático en backend: cada hora

### **Payment Intent**:
- Expiración: 24 horas (configurable en Stripe)
- Debe confirmarse dentro de ese período

### **Session ID**:
- Persiste hasta completar compra o liberar manualmente
- Se limpia al hacer clearCart()

---

## 📊 MÉTRICAS Y TRACKING

**Eventos trackeados** (listos para analytics):
1. Obra vista (detail page)
2. Obra agregada al carrito
3. Inicio de checkout
4. Pago completado
5. Orden creada

**Información de orden guardada**:
- Payment Intent ID (para reconciliación con Stripe)
- Timestamp de creación
- Items comprados
- Total pagado
- Información de envío completa
- Estado de envío (pendiente, enviado, entregado)

---

### **FLUJO ADMIN (Gestión de Órdenes)**

```
1. Admin Access
   LoginPage → Firebase Auth → DashboardPage

2. View Orders
   OrdersPage → useOrders() → Display DataTable

3. Update Status
   OrderDetailModal → Select "enviado"
   ├── Enter tracking_number
   ├── Enter tracking_link
   └── Click "Actualizar"

4. Send Email
   ordersService.updateOrderStatus()
   ├── Update DB
   ├── Query invalidation (React Query)
   └── EmailJS.sendShipmentNotification()
       ├── to_email, to_name
       ├── order_id, tracking info
       └── items list
```

### **FLUJO DE AUTENTICACIÓN**

```
1. Login
   LoginPage → Firebase signInWithEmailAndPassword()

2. Context Update
   AuthContextFirebase.setUser(userData)
   ├── user: { email, role, uid }
   ├── isAuthenticated: true
   └── Redirect to intended page

3. Protected Routes
   ProtectedRoute → Check AuthContext
   ├── Si NO auth → Redirect /login
   ├── Si NO role match → Redirect /unauthorized
   └── Si OK → Render children

4. Logout
   PillNav/MobileDock → logout()
   ├── Firebase signOut()
   ├── Clear AuthContext
   └── Redirect to /
```

## 🎨 Sistema de Diseño

### **Colores Principales**
```
- Verde Principal: #8FDF00 (botones de acción)
- Azul Marca: #0000fd (logo PIEDRA)
- Sección Hero: #5F6D9A
- Welcome Background: #191E2C
- White: #ffffff (fondos limpios)
```

### **Componentes Estilizados**

```
Green Button (Estilo Consistente)
├── variant="glass"
├── backgroundColor: #8FDF00
├── className: "text-xl md:text-xl px-16 md:px-6 py-3 md:py-1.5"
└── Usado en:
    ├── HeroSection (BUY NOW!)
    ├── ObraActions (Agregar al carrito)
    ├── CartPage (Iniciar sesión)
    └── CheckoutPage (Confirmar Compra)

Card Container
├── Card component (shadcn/ui)
├── className: "dark:bg-white/[0.03] dark:backdrop-blur-xl"
├── rounded-lg (excepto donde se especifique)
└── Usado en: Forms, Summaries, Details

Layouts
├── PublicLayout
│   ├── noPadding option
│   ├── backgroundColor option
│   └── Default gradient background
└── Max-width: 7xl (1280px)
```

## 📦 Dependencias Clave

```
Frontend
├── React 18 + TypeScript
├── React Router DOM (navegación)
├── React Query (server state)
├── Stripe (@stripe/react-stripe-js)
├── Three.js + R3F (3D models)
├── Framer Motion (animaciones)
├── Tailwind CSS (estilos)
├── shadcn/ui (componentes)
├── Sonner (notifications)
├── EmailJS (email notifications)
└── Cloudinary (image hosting)

Backend
├── Express.js
├── MySQL (database)
├── Firebase Admin (auth)
├── CORS, Rate Limiting
└── Stripe (payment processing)
```

## 🚀 Flujo de Deployment

```
Development
├── npm run dev (Vite dev server)
└── Branch: develop

Production
├── Branch: main
├── Vercel (frontend)
│   ├── Auto-deploy on push to main
│   ├── Deploy Hook: Production Deploy
│   └── URL: vercel.app
└── Railway (backend API)
    ├── Auto-deploy on push
    └── Environment variables configured
```

---

## 📝 Notas Importantes

1. **Imágenes**: Todas las imágenes de obras se suben a Cloudinary y se almacenan las URLs en la BD
2. **Autenticación**: Firebase para auth, pero roles gestionados en MySQL
3. **Payments**: Stripe en modo test (usar tarjeta 4242 4242 4242 4242)
4. **Emails**: EmailJS para notificaciones de envío (require tracking_number + tracking_link)
5. **Estado de Obras**: Se actualiza automáticamente según ubicación (tienda/expo/online/almacén)
6. **Carrito**: Persiste en localStorage, se limpia al completar orden

---

**Última actualización**: 29 de Octubre, 2025
**Versión**: Sprint 8 - Production Ready
