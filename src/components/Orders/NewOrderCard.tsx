import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package } from "lucide-react";
import { formatPrice } from "../../utils/formatters";
import type { Order } from "../../hooks/useOrders";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-300",
    iconColor: "text-yellow-700",
  },
  paid: {
    label: "Pagado",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-300",
    iconColor: "text-blue-700",
  },
  processing_shipment: {
    label: "Preparando Envío",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-300",
    iconColor: "text-purple-700",
  },
  shipped: {
    label: "Enviado",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-300",
    iconColor: "text-indigo-700",
  },
  delivered: {
    label: "Entregado",
    badgeClass: "bg-green-50 text-green-700 border-green-300",
    iconColor: "text-green-700",
  },
  pending_return: {
    label: "Devolución Pendiente",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-300",
    iconColor: "text-orange-700",
  },
  never_delivered: {
    label: "No Entregado",
    badgeClass: "bg-red-50 text-red-700 border-red-300",
    iconColor: "text-red-700",
  },
  cancelled: {
    label: "Cancelado",
    badgeClass: "bg-gray-50 text-gray-700 border-gray-300",
    iconColor: "text-gray-700",
  },
} as const;

interface NewOrderCardProps {
  order: Order;
}

export default function NewOrderCard({ order }: NewOrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];
  const showTracking = order.status === "shipped" || order.status === "delivered";
  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);

  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium tracking-wide">
                Orden #{order.order_number}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(order.created_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Badge className={`text-sm font-medium border ${statusConfig.badgeClass}`}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Artículos:</p>
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.cantidad || 1}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${formatPrice(item.precio)}</p>
              </div>
            ))}
          </div>

          {/* Tracking Info */}
          {showTracking && order.tracking_number && (
            <div
              className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg p-4 space-y-2`}
            >
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Información de Envío
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <span className="font-mono">{order.tracking_number}</span>
                {order.carrier && <span>• {order.carrier}</span>}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.shipping_snapshot && (
            <div className="text-sm space-y-1">
              <p className="font-medium text-muted-foreground">Envío a:</p>
              <p className="text-foreground">
                {typeof order.shipping_snapshot === 'string'
                  ? JSON.parse(order.shipping_snapshot).nombre_completo
                  : order.shipping_snapshot.nombre_completo}
              </p>
              <p className="text-muted-foreground text-xs">
                {typeof order.shipping_snapshot === 'string'
                  ? (() => {
                      const addr = JSON.parse(order.shipping_snapshot);
                      return `${addr.direccion} ${addr.numero_exterior}, ${addr.ciudad}, ${addr.estado} ${addr.codigo_postal}`;
                    })()
                  : `${order.shipping_snapshot.direccion} ${order.shipping_snapshot.numero_exterior}, ${order.shipping_snapshot.ciudad}, ${order.shipping_snapshot.estado} ${order.shipping_snapshot.codigo_postal}`
                }
              </p>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-foreground/10 flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <p className="text-2xl font-light tracking-wide">
              ${formatPrice(order.total)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
