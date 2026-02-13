import { business } from '@/config/business';

export interface InventoryState {
  plates: number;
  cups: number;
  cutlery: number;
  tables: number;
  chairs: number;
  tablecloths: number;
}

export interface ServicesState {
  setup: boolean;
  serving: boolean;
}

export function calcInventorySubtotal(inv: InventoryState): number {
  return Object.entries(inv).reduce((sum, [key, qty]) => {
    const price = business.inventory[key]?.price || 0;
    return sum + price * qty;
  }, 0);
}

export function calcServicesTotal(services: ServicesState): number {
  let total = 0;
  if (services.setup) total += business.services.setup;
  if (services.serving) total += business.services.serving;
  return total;
}

export function calcDeliveryFee(foodAndInventorySubtotal: number): number {
  return foodAndInventorySubtotal >= business.delivery.freeThreshold
    ? 0
    : business.delivery.baseFee;
}

export function calcGrandTotal(
  foodSubtotal: number,
  inventorySubtotal: number,
  servicesTotal: number,
  deliveryFee: number
): number {
  return foodSubtotal + inventorySubtotal + servicesTotal + deliveryFee;
}

export const emptyInventory: InventoryState = {
  plates: 0, cups: 0, cutlery: 0, tables: 0, chairs: 0, tablecloths: 0,
};

export const emptyServices: ServicesState = {
  setup: false, serving: false,
};
