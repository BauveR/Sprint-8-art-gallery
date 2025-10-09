import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { EstadoVenta } from "../types";

export const ESTADO_CONFIG: Record<
  EstadoVenta,
  {
    label: string;
    icon: any;
    badgeClass: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  disponible: {
    label: "Disponible",
    icon: ShoppingBag,
    badgeClass:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    iconColor: "text-gray-500 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  en_carrito: {
    label: "En Carrito",
    icon: ShoppingBag,
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700",
    iconColor: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  procesando_envio: {
    label: "Procesando Envío",
    icon: Package,
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-400 dark:border-yellow-700",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  enviado: {
    label: "En Camino",
    icon: Truck,
    badgeClass:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-400 dark:border-cyan-700",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  entregado: {
    label: "Entregado",
    icon: CheckCircle,
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-400 dark:border-green-700",
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  pendiente_devolucion: {
    label: "Pendiente Devolución",
    icon: AlertCircle,
    badgeClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-400 dark:border-orange-700",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  nunca_entregado: {
    label: "No Entregado",
    icon: AlertCircle,
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-400 dark:border-red-700",
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
};
