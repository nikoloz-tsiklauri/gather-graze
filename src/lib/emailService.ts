import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, business } from '@/config/business';

export interface OrderData {
  orderId: string;
  language: string;
  customer: { name: string; phone: string; email: string };
  event: { date: string; startTime: string; endTime: string };
  address: { street: string; building: string; apartment: string; notes: string };
  guests: number;
  products: Array<{ name: string; unit: string; qty: number; unitPrice: number; lineTotal: number }>;
  inventory: Array<{ name: string; qty: number; unitPrice: number; lineTotal: number }>;
  services: string[];
  foodSubtotal: number;
  inventorySubtotal: number;
  servicesTotal: number;
  deliveryFee: number;
  grandTotal: number;
  dietary: string;
  comments: string;
}

function formatOrderText(order: OrderData): string {
  let text = `ORDER #${order.orderId}\nLanguage: ${order.language}\n\n`;
  text += `CUSTOMER\n${order.customer.name}\n${order.customer.phone}\n${order.customer.email}\n\n`;
  text += `EVENT\nDate: ${order.event.date} | ${order.event.startTime}${order.event.endTime ? ' - ' + order.event.endTime : ''}\nGuests: ${order.guests}\n\n`;
  text += `ADDRESS\n${order.address.street}, ${order.address.building}${order.address.apartment ? ', apt. ' + order.address.apartment : ''}\n${order.address.notes ? 'Notes: ' + order.address.notes : ''}\n\n`;
  text += `PRODUCTS\n`;
  order.products.forEach(p => {
    text += `  ${p.name} x${p.qty} (${p.unitPrice}₾/${p.unit}) = ${p.lineTotal}₾\n`;
  });
  text += `\nFood subtotal: ${order.foodSubtotal}₾\n`;
  if (order.inventory.length > 0) {
    text += `\nINVENTORY\n`;
    order.inventory.forEach(i => {
      text += `  ${i.name} x${i.qty} (${i.unitPrice}₾) = ${i.lineTotal}₾\n`;
    });
    text += `Inventory subtotal: ${order.inventorySubtotal}₾\n`;
  }
  if (order.services.length > 0) {
    text += `\nSERVICES: ${order.services.join(', ')}\nServices total: ${order.servicesTotal}₾\n`;
  }
  text += `\nDelivery: ${order.deliveryFee === 0 ? 'FREE' : order.deliveryFee + '₾'}\n`;
  text += `GRAND TOTAL: ${order.grandTotal}₾\n`;
  if (order.dietary) text += `\nDietary/Allergies: ${order.dietary}\n`;
  if (order.comments) text += `Comments: ${order.comments}\n`;
  return text;
}

export async function sendOrderEmail(order: OrderData): Promise<boolean> {
  const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

  if (serviceId && templateId && publicKey) {
    try {
      await emailjs.send(serviceId, templateId, {
        to_email: business.email,
        order_id: order.orderId,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_email: order.customer.email,
        order_details: formatOrderText(order),
        grand_total: order.grandTotal,
      }, publicKey);
      return true;
    } catch (err) {
      console.error('EmailJS failed, falling back to mailto:', err);
    }
  }

  // Mailto fallback
  const subject = encodeURIComponent(`New Order #${order.orderId}`);
  const body = encodeURIComponent(formatOrderText(order));
  window.open(`mailto:${business.email}?subject=${subject}&body=${body}`, '_self');
  return true;
}

export function generateOrderId(): string {
  return `FS-${Date.now().toString(36).toUpperCase()}`;
}
