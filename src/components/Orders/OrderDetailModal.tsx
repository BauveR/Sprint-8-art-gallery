import { useState } from "react";
import { useOrder, useOrderHistory, type OrderStatus } from "@/hooks/useOrders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, MapPin, User, Calendar, Truck, X } from "lucide-react";

interface OrderDetailModalProps {
  orderId: number;
  onClose: () => void;
  onUpdateStatus: (
    orderId: number,
    status: OrderStatus,
    additionalData?: { tracking_number?: string; carrier?: string; admin_notes?: string }
  ) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "processing_shipment", label: "Procesando envío" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "pending_return", label: "Devolución pendiente" },
  { value: "never_delivered", label: "No entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrderDetailModal({ orderId, onClose, onUpdateStatus }: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrder(orderId);
  const { data: history = [] } = useOrderHistory(orderId);

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingLink, setTrackingLink] = useState("");

  if (isLoading || !order) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando orden...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const handleUpdateStatus = () => {
    if (!newStatus) return;

    const additionalData: any = {};
    if (trackingNumber) additionalData.tracking_number = trackingNumber;
    if (carrier) additionalData.carrier = carrier;
    if (trackingLink) additionalData.tracking_link = trackingLink;

    onUpdateStatus(orderId, newStatus as OrderStatus, additionalData);

    // Limpiar formulario y cerrar modal
    setNewStatus("");
    setTrackingNumber("");
    setCarrier("");
    setTrackingLink("");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Orden {order.order_number}</DialogTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Cliente</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Nombre</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.user_name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.user_email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Dirección de Envío</h3>
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              <p className="font-medium">{order.shipping_snapshot.nombre_completo}</p>
              <p>{order.shipping_snapshot.direccion} {order.shipping_snapshot.numero_exterior}</p>
              {order.shipping_snapshot.numero_interior && <p>Int. {order.shipping_snapshot.numero_interior}</p>}
              <p>{order.shipping_snapshot.colonia}, CP {order.shipping_snapshot.codigo_postal}</p>
              <p>{order.shipping_snapshot.ciudad}, {order.shipping_snapshot.estado}</p>
              <p className="mt-2">Tel: {order.shipping_snapshot.telefono}</p>
              {order.shipping_snapshot.referencias && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Referencias: {order.shipping_snapshot.referencias}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Items</h3>
            </div>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.titulo}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cantidad: {item.cantidad || 1}</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.precio)}</p>
                </div>
              ))}
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shipping_cost)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Impuestos</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-zinc-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {(order.tracking_number || order.carrier) && (
            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Información de Envío</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {order.carrier && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Paquetería</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.carrier}</p>
                  </div>
                )}
                {order.tracking_number && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Número de Rastreo</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.tracking_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Fechas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Creada</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.created_at)}</p>
              </div>
              {order.paid_at && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Pagada</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.paid_at)}</p>
                </div>
              )}
              {order.shipped_at && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Enviada</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.shipped_at)}</p>
                </div>
              )}
              {order.delivered_at && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Entregada</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.delivered_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Update Status Form */}
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actualizar Estado</h3>
            <div className="space-y-4">
              <div>
                <Label>Nuevo Estado</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newStatus === "shipped" && (
                <>
                  <div>
                    <Label>Paquetería</Label>
                    <Input
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="FedEx, DHL, Estafeta..."
                    />
                  </div>
                  <div>
                    <Label>Número de Rastreo</Label>
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Ingresa el número de rastreo"
                    />
                  </div>
                  <div>
                    <Label>Link de Seguimiento</Label>
                    <Input
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleUpdateStatus}
                disabled={!newStatus}
                className="w-full"
              >
                Actualizar Estado
              </Button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Historial de Cambios</h3>
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id_history}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg text-sm"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        {entry.status_from ? `${entry.status_from} → ` : ""}
                        <Badge className="ml-1">{entry.status_to}</Badge>
                      </p>
                      {entry.notes && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                      )}
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                        {formatDate(entry.created_at)} - {entry.changed_by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
