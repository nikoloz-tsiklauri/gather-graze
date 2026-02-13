import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { business } from '@/config/business';
import {
  calcInventorySubtotal, calcServicesTotal, calcDeliveryFee, calcGrandTotal,
  emptyInventory, emptyServices, type InventoryState, type ServicesState,
} from '@/lib/pricing';
import { sendOrderEmail, generateOrderId, type OrderData } from '@/lib/emailService';
import { toast } from '@/hooks/use-toast';

const inventoryKeys = ['plates', 'cups', 'cutlery', 'tables', 'chairs', 'tablecloths'] as const;

const Checkout: React.FC = () => {
  const { lang, t } = useLanguage();
  const { items, getProduct, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Checkout page guard - redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast({
        description: t('cart.emptyToast'),
        duration: 4000,
      });
      navigate('/menu');
      
      // Scroll to product list after navigation
      setTimeout(() => {
        const menuList = document.getElementById('menu-list');
        if (menuList) {
          menuList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [items.length, navigate, t]);

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    date: '', startTime: '', endTime: '',
    street: '', building: '', apartment: '', addressNotes: '',
    guests: 1,
    dietary: '', comments: '',
    privacy: false,
  });
  const [inventory, setInventory] = useState<InventoryState>(emptyInventory);
  const [services, setServices] = useState<ServicesState>(emptyServices);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const inventorySubtotal = calcInventorySubtotal(inventory);
  const servicesTotal = calcServicesTotal(services);
  const deliveryFee = calcDeliveryFee(cartSubtotal + inventorySubtotal);
  const grandTotal = calcGrandTotal(cartSubtotal, inventorySubtotal, servicesTotal, deliveryFee);

  const updateField = (key: string, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const updateInventory = (key: string, val: number) => {
    setInventory(prev => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const validate = (): boolean => {
    const required = ['name', 'phone', 'email', 'date', 'startTime', 'street', 'building'];
    const errs: Record<string, boolean> = {};
    required.forEach(k => { if (!form[k as keyof typeof form]) errs[k] = true; });
    if (!form.privacy) errs.privacy = true;
    if (form.guests < 1) errs.guests = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const orderId = generateOrderId();
    const orderProducts = items.map(item => {
      const p = getProduct(item.productId);
      return {
        name: p ? (p.name[lang] || p.name.en) : item.productId,
        unit: p ? t(`unit.${p.unit}`) : '',
        qty: item.quantity,
        unitPrice: p?.price || 0,
        lineTotal: (p?.price || 0) * item.quantity,
      };
    });

    const orderInventory = inventoryKeys
      .filter(k => inventory[k] > 0)
      .map(k => ({
        name: t(`checkout.inventoryItems.${k}`),
        qty: inventory[k],
        unitPrice: business.inventory[k].price,
        lineTotal: business.inventory[k].price * inventory[k],
      }));

    const servicesList: string[] = [];
    if (services.setup) servicesList.push(t('checkout.setup'));
    if (services.serving) servicesList.push(t('checkout.serving'));

    const orderData: OrderData = {
      orderId, language: lang.toUpperCase(),
      customer: { name: form.name, phone: form.phone, email: form.email },
      event: { date: form.date, startTime: form.startTime, endTime: form.endTime },
      address: { street: form.street, building: form.building, apartment: form.apartment, notes: form.addressNotes },
      guests: form.guests,
      products: orderProducts,
      inventory: orderInventory,
      services: servicesList,
      foodSubtotal: cartSubtotal,
      inventorySubtotal, servicesTotal, deliveryFee, grandTotal,
      dietary: form.dietary, comments: form.comments,
    };

    await sendOrderEmail(orderData);
    clearCart();
    navigate('/order-success', { state: { orderId, grandTotal } });
  };

  const inputCls = (key: string) =>
    `w-full rounded-lg border ${errors[key] ? 'border-destructive' : 'border-border'} bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring`;

  return (
    <main className="py-10">
      <div className="container max-w-4xl">
        <h1 className="heading-display text-3xl sm:text-4xl mb-8">{t('checkout.title')}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold mb-4">{t('checkout.customer')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">{t('checkout.name')} *</label>
                  <input value={form.name} onChange={e => updateField('name', e.target.value)} className={inputCls('name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.phone')} *</label>
                  <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls('phone')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.email')} *</label>
                  <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} />
                </div>
              </div>
            </section>

            {/* Event */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold mb-4">{t('checkout.event')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.date')} *</label>
                  <input type="date" value={form.date} onChange={e => updateField('date', e.target.value)} className={inputCls('date')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.startTime')} *</label>
                  <input type="time" value={form.startTime} onChange={e => updateField('startTime', e.target.value)} className={inputCls('startTime')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.endTime')}</label>
                  <input type="time" value={form.endTime} onChange={e => updateField('endTime', e.target.value)} className={inputCls('endTime')} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">{t('checkout.guests')} *</label>
                <input type="number" min="1" value={form.guests} onChange={e => updateField('guests', parseInt(e.target.value) || 1)} className={inputCls('guests') + ' max-w-[120px]'} />
              </div>
            </section>

            {/* Address */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold mb-4">{t('checkout.address')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">{t('checkout.street')} *</label>
                  <input value={form.street} onChange={e => updateField('street', e.target.value)} className={inputCls('street')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.building')} *</label>
                  <input value={form.building} onChange={e => updateField('building', e.target.value)} className={inputCls('building')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('checkout.apartment')}</label>
                  <input value={form.apartment} onChange={e => updateField('apartment', e.target.value)} className={inputCls('apartment')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">{t('checkout.addressNotes')}</label>
                  <input value={form.addressNotes} onChange={e => updateField('addressNotes', e.target.value)} className={inputCls('addressNotes')} />
                </div>
              </div>
            </section>

            {/* Inventory */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold mb-1">{t('checkout.inventory')}</h2>
              <p className="text-xs text-muted-foreground mb-4">{t('checkout.inventoryNote')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inventoryKeys.map(key => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm">{t(`checkout.inventoryItems.${key}`)}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateInventory(key, inventory[key] - 1)} className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm hover:bg-secondary">−</button>
                      <span className="w-8 text-center text-sm font-medium">{inventory[key]}</span>
                      <button type="button" onClick={() => updateInventory(key, inventory[key] + 1)} className="h-7 w-7 rounded border border-border flex items-center justify-center text-sm hover:bg-secondary">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold mb-4">{t('checkout.services')}</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={services.setup} onChange={e => setServices(s => ({ ...s, setup: e.target.checked }))} className="h-4 w-4 rounded border-border" />
                  <span className="text-sm">{t('checkout.setup')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={services.serving} onChange={e => setServices(s => ({ ...s, serving: e.target.checked }))} className="h-4 w-4 rounded border-border" />
                  <span className="text-sm">{t('checkout.serving')}</span>
                </label>
              </div>
            </section>

            {/* Notes */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.dietary')}</label>
                <textarea value={form.dietary} onChange={e => updateField('dietary', e.target.value)} rows={2} className={inputCls('dietary') + ' resize-none'} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.comments')}</label>
                <textarea value={form.comments} onChange={e => updateField('comments', e.target.value)} rows={2} className={inputCls('comments') + ' resize-none'} />
              </div>
            </section>

            {/* Privacy */}
            <label className={`flex items-start gap-3 cursor-pointer ${errors.privacy ? 'text-destructive' : ''}`}>
              <input type="checkbox" checked={form.privacy} onChange={e => updateField('privacy', e.target.checked)} className="mt-1 h-4 w-4 rounded border-border" />
              <span className="text-sm">{t('checkout.privacy')} *</span>
            </label>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-20 space-y-4">
              <h3 className="font-heading text-xl font-semibold">{t('checkout.orderSummary')}</h3>
              {items.length > 0 && (
                <div className="space-y-2 text-sm">
                  {items.map(item => {
                    const p = getProduct(item.productId);
                    if (!p) return null;
                    return (
                      <div key={item.productId} className="flex justify-between">
                        <span className="text-muted-foreground truncate mr-2">{(p.name[lang] || p.name.en)} ×{item.quantity}</span>
                        <span className="font-medium whitespace-nowrap">{(p.price * item.quantity).toFixed(2)}₾</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t('checkout.foodSubtotal')}</span><span>{cartSubtotal.toFixed(2)}₾</span></div>
                {inventorySubtotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t('checkout.inventorySubtotal')}</span><span>{inventorySubtotal.toFixed(2)}₾</span></div>}
                {servicesTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t('checkout.servicesSubtotal')}</span><span>{servicesTotal.toFixed(2)}₾</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.delivery')}</span><span>{deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}₾`}</span></div>
                <div className="border-t border-border pt-2 flex justify-between text-base font-bold"><span>{t('cart.total')}</span><span className="text-primary">{grandTotal.toFixed(2)}₾</span></div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-accent py-3 font-semibold text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {submitting ? t('common.loading') : t('checkout.submit')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
