import * as ordersRepo from "../repositories/ordersRepo";

export async function getOrdersByEmail(email: string) {
  return ordersRepo.findOrdersByEmail(email);
}
