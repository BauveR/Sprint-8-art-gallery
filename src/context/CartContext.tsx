import { createContext, useContext, ReactNode, useMemo } from "react";
import { Obra } from "../types";
import {
  useMyCart,
  useAddToCart,
  useRemoveFromCart,
  useReleaseAllReservas,
  type Reserva
} from "../hooks/useReservas";
import { useObras } from "../query/obras";
import { toast } from "sonner";

interface CartItem {
  obra: Obra;
  quantity: number;
  reserva?: Reserva;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (obra: Obra) => void;
  removeFromCart: (obraId: number) => void;
  updateQuantity: (obraId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Usar hooks de reservas en lugar de localStorage
  const { data: reservas = [], isLoading: loadingReservas } = useMyCart();
  const { data: obrasData, isLoading: loadingObras } = useObras({ pageSize: 1000 });
  const obras = obrasData?.data || [];
  const addMutation = useAddToCart();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useReleaseAllReservas();

  // Construir items del carrito desde reservas y obras
  const items = useMemo<CartItem[]>(() => {
    if (!reservas || !obras) return [];

    const mappedItems = reservas
      .map((reserva) => {
        const obra = obras.find((o: Obra) => o.id_obra === reserva.id_obra);
        if (!obra) return null;

        return {
          obra,
          quantity: 1, // Las obras de arte son únicas, cantidad siempre 1
          reserva,
        } as CartItem;
      })
      .filter((item): item is CartItem => item !== null);

    return mappedItems;
  }, [reservas, obras]);

  const addToCart = async (obra: Obra) => {
    try {
      await addMutation.mutateAsync(obra.id_obra);
      toast.success(`${obra.titulo} agregado al carrito`);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al agregar al carrito";
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (obraId: number) => {
    try {
      await removeMutation.mutateAsync(obraId);
      toast.success("Obra removida del carrito");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al remover del carrito";
      toast.error(message);
      throw error;
    }
  };

  const updateQuantity = (obraId: number, quantity: number) => {
    // Para obras de arte, la cantidad siempre es 1 (son únicas)
    // Si quantity es 0 o menor, remover del carrito
    if (quantity <= 0) {
      removeFromCart(obraId);
    }
  };

  const clearCart = async () => {
    try {
      await clearMutation.mutateAsync();
      toast.success("Carrito limpiado");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al limpiar el carrito";
      toast.error(message);
      throw error;
    }
  };

  const totalItems = items.length; // Cada obra es única, total = número de items

  const totalPrice = items.reduce((sum, item) => {
    if (!item) return sum;
    const price = Number(item.obra.precio_salida) || 0;
    return sum + price;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading: loadingReservas || loadingObras,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
