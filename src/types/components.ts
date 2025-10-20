/**
 * Types de props para componentes reutilizables
 */

import { Obra, ObraImagen } from "./index";
import { Order } from "./orders";
import { ReactNode } from "react";
import { CheckoutFormData } from "./forms";

// ====== Componentes de Obra ======

/**
 * Props para el componente ObraCard
 */
export interface ObraCardProps {
  obra: Obra;
  onAddToCart: (obra: Obra) => void;
  onViewDetails: () => void;
}

/**
 * Props para el componente ObraInfo
 */
export interface ObraInfoProps {
  obra: Obra;
  isAvailable: boolean;
}

/**
 * Props para el componente ObraActions
 */
export interface ObraActionsProps {
  obra: Obra;
  isInCart: boolean;
  isAvailable: boolean;
  isInExhibition: boolean;
  canPurchase: boolean;
  onAddToCart: () => void;
}

/**
 * Props para el componente ObraImageGallery
 */
export interface ObraImageGalleryProps {
  images: ObraImagen[];
  obraId: number;
  obraTitulo: string;
}

// ====== Componentes de Checkout ======

/**
 * Props para el componente ShippingForm
 */
export interface ShippingFormProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Props para el componente OrderSummary
 */
export interface OrderSummaryProps {
  isProcessing: boolean;
  onSubmit: () => void;
}

// ====== Componentes Genéricos ======

/**
 * Props para componentes genéricos de Location (Tiendas/Expos)
 */
export interface LocationFormProps<T> {
  form: T;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (form: T) => void;
  isSubmitting: boolean;
  submitLabel: string;
  children?: ReactNode;
}

export interface LocationTableProps<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  emptyMessage: string;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  getItemId: (item: T) => number;
  headers: string[];
  renderRow: (item: T) => ReactNode;
}

export interface LocationEditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: T;
  onChange: (form: T) => void;
  isSubmitting: boolean;
  title: string;
  children?: ReactNode;
}

// ====== Componentes de Autenticación ======

/**
 * Props para el componente ProtectedRoute
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<string>;
}

// ====== Componentes de Cart ======

/**
 * Props para el componente CartItem
 */
export interface CartItemProps {
  obra: Obra;
  quantity: number;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

// ====== Componentes de Orders ======

/**
 * Props para el componente OrderCard
 */
export interface OrderCardProps {
  order: Order;
}
