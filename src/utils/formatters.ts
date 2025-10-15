/**
 * Formatea un precio en formato español
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return "N/A";
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toLocaleString("es-ES");
}
