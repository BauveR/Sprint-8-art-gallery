import { useCart } from "../context/CartContext";

/**
 * Hook para verificar si una obra está en el carrito
 */
export function useIsInCart(obraId: number): boolean {
  const { items } = useCart();
  return items.some((item) => item.obra.id_obra === obraId);
}
