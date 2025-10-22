import { useState } from "react";
import { useOrders, useOrderStats, useUpdateOrderStatus, type OrderStatus } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Package, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  sendShipmentNotification,
} from "@/config/emailjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrdersTable from "./OrdersTable";
import OrderDetailModal from "./OrderDetailModal";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "processing_shipment", label: "Procesando envío" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "pending_return", label: "Devolución pendiente" },
  { value: "never_delivered", label: "No entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrdersPage() {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Datos del servidor
  const { data: ordersData, isLoading } = useOrders({
    status: selectedStatus !== "all" ? (selectedStatus as OrderStatus) : undefined,
    search: searchQuery || undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  const { data: stats } = useOrderStats();
  const updateStatus = useUpdateOrderStatus();

  const orders = ordersData?.data ?? [];
  const total = ordersData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleUpdateStatus = async (
    orderId: number,
    status: OrderStatus,
    additionalData?: {
      tracking_number?: string;
      carrier?: string;
      tracking_link?: string;
      admin_notes?: string;
    }
  ) => {
    try {
      // Encontrar la orden actual para obtener info del cliente y estado anterior
      const currentOrder = orders.find((o) => o.id_orden === orderId);
      const previousStatus = currentOrder?.status;

      // Actualizar el estado en el backend
      await updateStatus.mutateAsync({
        id: orderId,
        status,
        ...additionalData,
      });

      toast({
        title: "Estado actualizado",
        description: `La orden ha sido actualizada a: ${STATUS_OPTIONS.find((s) => s.value === status)?.label}`,
      });

      // Enviar emails según el cambio de estado
      if (currentOrder?.user_email) {
        try {
          // Email de envío (cuando cambia a "shipped")
          if (status === "shipped" && previousStatus !== "shipped") {
            if (additionalData?.tracking_number && additionalData?.tracking_link) {
              await sendShipmentNotification({
                to_email: currentOrder.user_email,
                to_name: currentOrder.user_name || "Cliente",
                order_id: currentOrder.order_number,
                tracking_number: additionalData.tracking_number,
                carrier: additionalData.carrier || "Servicio de paquetería",
                tracking_link: additionalData.tracking_link,
                items: currentOrder.items.map((item: any) => ({ titulo: item.titulo })),
              });
              toast({
                title: "Email enviado",
                description: "Se ha notificado al cliente sobre el envío",
              });
            }
          }

          // Email de entrega (cuando cambia a "delivered")
          // Nota: Email de delivery deshabilitado (requiere template adicional en plan premium)
          if (status === "delivered" && previousStatus !== "delivered") {
            console.log("Orden marcada como entregada:", currentOrder.order_number);
            // TODO: Habilitar cuando se actualice el plan de EmailJS
          }
        } catch (emailError) {
          console.error("Error enviando email:", emailError);
          toast({
            title: "Advertencia",
            description: "La orden se actualizó pero no se pudo enviar el email",
            variant: "default",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Órdenes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Administra y rastrea todas las órdenes de compra
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Órdenes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pending + stats.processing}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Entregadas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivered}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats.total_revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters" className="border rounded-lg bg-white dark:bg-zinc-800 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="font-semibold">Filtros de búsqueda</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Buscar
                  </label>
                  <Input
                    placeholder="Buscar por número de orden, email o nombre..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Estado
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => {
                      setSelectedStatus(value);
                      setPage(1);
                    }}
                  >
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
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                    setPage(1);
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Orders Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onViewDetails={(id) => setSelectedOrderId(id)}
            onUpdateStatus={handleUpdateStatus}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-zinc-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total} órdenes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Página {page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
