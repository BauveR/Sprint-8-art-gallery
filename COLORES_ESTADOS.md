# Código de Colores - Estados de Compras

Esta es la paleta de colores estandarizada para los estados de las compras, aplicada consistentemente en toda la aplicación.

## 🎨 Paleta de Colores

### 1️⃣ Disponible
- **Color**: Gris (`gray`)
- **Icono**: 🛍️ Shopping Bag
- **Badge**: Fondo gris claro, texto gris oscuro
- **Significado**: La obra está disponible para compra
- **Hex**:
  - Light: `#F3F4F6` (bg) / `#374151` (text)
  - Dark: `#1F2937` (bg) / `#D1D5DB` (text)

### 2️⃣ En Carrito
- **Color**: Azul (`blue`)
- **Icono**: 🛍️ Shopping Bag
- **Badge**: Fondo azul claro, texto azul oscuro
- **Significado**: La obra está en el carrito pero no comprada
- **Hex**:
  - Light: `#DBEAFE` (bg) / `#1D4ED8` (text)
  - Dark: `#1E3A8A` (bg) / `#93C5FD` (text)

### 3️⃣ Procesando Envío
- **Color**: Amarillo (`yellow`)
- **Icono**: 📦 Package
- **Badge**: Fondo amarillo claro, texto amarillo oscuro
- **Significado**: El pago fue confirmado, preparando envío
- **Hex**:
  - Light: `#FEF3C7` (bg) / `#92400E` (text)
  - Dark: `#78350F` (bg) / `#FCD34D` (text)

### 4️⃣ Enviado / En Camino
- **Color**: Cyan (`cyan`)
- **Icono**: 🚚 Truck
- **Badge**: Fondo cyan claro, texto cyan oscuro
- **Significado**: El paquete está en tránsito
- **Hex**:
  - Light: `#CFFAFE` (bg) / `#155E75` (text)
  - Dark: `#164E63` (bg) / `#67E8F9` (text)
- **Extra**: Incluye información de tracking

### 5️⃣ Entregado
- **Color**: Verde (`green`)
- **Icono**: ✅ Check Circle
- **Badge**: Fondo verde claro, texto verde oscuro
- **Significado**: El paquete fue entregado exitosamente
- **Hex**:
  - Light: `#D1FAE5` (bg) / `#065F46` (text)
  - Dark: `#064E3B` (bg) / `#6EE7B7` (text)

### 6️⃣ Pendiente Devolución
- **Color**: Naranja (`orange`)
- **Icono**: ⚠️ Alert Circle
- **Badge**: Fondo naranja claro, texto naranja oscuro
- **Significado**: Hay un problema, se procesará devolución
- **Hex**:
  - Light: `#FFEDD5` (bg) / `#9A3412` (text)
  - Dark: `#7C2D12` (bg) / `#FDBA74` (text)

### 7️⃣ No Entregado
- **Color**: Rojo (`red`)
- **Icono**: ❌ Alert Circle
- **Badge**: Fondo rojo claro, texto rojo oscuro
- **Significado**: El pedido no pudo ser entregado
- **Hex**:
  - Light: `#FEE2E2` (bg) / `#991B1B` (text)
  - Dark: `#7F1D1D` (bg) / `#FCA5A5` (text)

## 📍 Aplicación en la Interfaz

### Página "Mis Compras" (Usuario)
```tsx
┌─────────────────────────────────────────┐
│ [Imagen de la obra]                     │
│                                         │
│ Título de la Obra                       │
│ Nombre del Autor                        │
│                                         │
│ 🚚 [En Camino] ← Badge con color cyan  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Información de Envío    ← Cyan bg   │ │
│ │ ABC123456789                        │ │
│ │ 🔗 Rastrear paquete                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Comprado el 15 de enero de 2025        │
│ $1,250.00                               │
└─────────────────────────────────────────┘
```

### Panel de Administración
```tsx
┌──────┬────────┬────────┬──────────────────┬────────────┐
│ ID   │ Autor  │ Título │ Estado           │ Ubicación  │
├──────┼────────┼────────┼──────────────────┼────────────┤
│ 1    │ Juan   │ Obra A │ [Procesando]     │ Online     │
│      │        │        │  ← Yellow badge  │            │
├──────┼────────┼────────┼──────────────────┼────────────┤
│ 2    │ María  │ Obra B │ [En Camino]      │ Online     │
│      │        │        │  ← Cyan badge    │            │
└──────┴────────┴────────┴──────────────────┴────────────┘
```

## 🎯 Consistencia Visual

### Principios de Diseño
1. **Colores semánticos**: Cada color representa un estado específico
2. **Modo claro/oscuro**: Todos los colores adaptan automáticamente
3. **Accesibilidad**: Contraste WCAG AA cumplido
4. **Coherencia**: Mismos colores en toda la app (admin + usuario)

### Elementos Afectados
- ✅ Badges de estado
- ✅ Iconos de estado
- ✅ Fondos de información de tracking
- ✅ Bordes de cards

## 🔧 Implementación Técnica

### Archivo de Configuración
`src/lib/estadoConfig.ts`

```typescript
export const ESTADO_CONFIG = {
  procesando_envio: {
    label: "Procesando Envío",
    icon: Package,
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30...",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  // ... más estados
}
```

### Uso en Componentes
```tsx
import { ESTADO_CONFIG } from "../lib/estadoConfig";

const config = ESTADO_CONFIG[order.estado_venta];
const Icon = config.icon;

<Badge className={`${config.badgeClass}`}>
  {config.label}
</Badge>
```

## 📊 Progreso del Pedido

El flujo visual de colores guía al usuario:

```
Disponible → En Carrito → Procesando → En Camino → Entregado
  (Gris)      (Azul)      (Amarillo)    (Cyan)     (Verde)
    ↓           ↓             ↓            ↓          ↓
  Neutral    Acción      Advertencia   Progreso   Éxito
```

Si hay problemas:
```
En Camino → Pendiente Devolución → No Entregado
  (Cyan)         (Naranja)            (Rojo)
    ↓               ↓                    ↓
Progreso       Precaución             Error
```

## 🎨 Tailwind Classes Usadas

### Backgrounds
- Gray: `bg-gray-100` / `dark:bg-gray-800`
- Blue: `bg-blue-100` / `dark:bg-blue-900/30`
- Yellow: `bg-yellow-100` / `dark:bg-yellow-900/30`
- Cyan: `bg-cyan-100` / `dark:bg-cyan-900/30`
- Green: `bg-green-100` / `dark:bg-green-900/30`
- Orange: `bg-orange-100` / `dark:bg-orange-900/30`
- Red: `bg-red-100` / `dark:bg-red-900/30`

### Text Colors
- Gray: `text-gray-700` / `dark:text-gray-300`
- Blue: `text-blue-700` / `dark:text-blue-300`
- Yellow: `text-yellow-800` / `dark:text-yellow-300`
- Cyan: `text-cyan-800` / `dark:text-cyan-300`
- Green: `text-green-800` / `dark:text-green-300`
- Orange: `text-orange-800` / `dark:text-orange-300`
- Red: `text-red-800` / `dark:text-red-300`

### Borders
- Gray: `border-gray-300` / `dark:border-gray-600`
- Blue: `border-blue-300` / `dark:border-blue-700`
- Yellow: `border-yellow-400` / `dark:border-yellow-700`
- Cyan: `border-cyan-400` / `dark:border-cyan-700`
- Green: `border-green-400` / `dark:border-green-700`
- Orange: `border-orange-400` / `dark:border-orange-700`
- Red: `border-red-400` / `dark:border-red-700`

## 🌓 Modo Oscuro

Todos los colores ajustan automáticamente:
- Backgrounds más oscuros con transparencia
- Textos más claros
- Bordes adaptados
- Contraste mantenido

## ✅ Testing de Colores

Para verificar que los colores se muestran correctamente:

1. **Crear pedidos de prueba** en cada estado
2. **Cambiar modo claro/oscuro** y verificar contraste
3. **Verificar accesibilidad** con herramientas de contraste
4. **Probar en diferentes dispositivos** (móvil, tablet, desktop)

## 📱 Responsive

Los colores mantienen consistencia en todos los tamaños de pantalla:
- Mobile: Badges más pequeños pero mismo color
- Tablet: Tamaño estándar
- Desktop: Tamaño completo con todos los detalles
