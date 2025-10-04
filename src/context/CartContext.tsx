import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Obra } from "../types";

interface CartItem {
  obra: Obra;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (obra: Obra) => void;
  removeFromCart: (obraId: number) => void;
  updateQuantity: (obraId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Cargar carrito desde localStorage
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (obra: Obra) => {
    setItems((current) => {
      const existing = current.find((item) => item.obra.id_obra === obra.id_obra);

      if (existing) {
        return current.map((item) =>
          item.obra.id_obra === obra.id_obra
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { obra, quantity: 1 }];
    });
  };

  const removeFromCart = (obraId: number) => {
    setItems((current) => current.filter((item) => item.obra.id_obra !== obraId));
  };

  const updateQuantity = (obraId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(obraId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.obra.id_obra === obraId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = item.obra.precio_salida ?? 0;
    return sum + price * item.quantity;
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
