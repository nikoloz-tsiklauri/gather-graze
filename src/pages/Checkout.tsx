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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus } from 'lucide-react';

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
    `w-full rounded-xl border ${errors[key] ? 'border-destructive ring-2 ring-destructive/20' : 'border-border/60'} bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all shadow-sm`;

  return (
    <main className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-6xl">
        <div className="mb-12">
          <h1 className="heading-display text-4xl sm:text-5xl mb-3 tracking-tight">{t('checkout.title')}</h1>
          <p className="text-muted-foreground text-lg">Complete your order details below</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">{t('checkout.customer')}</h2>
              <p className="text-xs text-muted-foreground mb-6">We'll use this to contact you about your order</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.name')} *</label>
                  <input value={form.name} onChange={e => updateField('name', e.target.value)} className={inputCls('name')} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.phone')} *</label>
                  <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls('phone')} placeholder="+995 555 123 456" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.email')} *</label>
                  <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} placeholder="email@example.com" />
                </div>
              </div>
            </Card>

            {/* Event */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">{t('checkout.event')}</h2>
              <p className="text-xs text-muted-foreground mb-6">When and where is your event?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.date')} *</label>
                  <input type="date" value={form.date} onChange={e => updateField('date', e.target.value)} className={inputCls('date')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.startTime')} *</label>
                  <input type="time" value={form.startTime} onChange={e => updateField('startTime', e.target.value)} className={inputCls('startTime')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.endTime')}</label>
                  <input type="time" value={form.endTime} onChange={e => updateField('endTime', e.target.value)} className={inputCls('endTime')} />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.guests')} *</label>
                <input type="number" min="1" value={form.guests} onChange={e => updateField('guests', parseInt(e.target.value) || 1)} className={inputCls('guests') + ' max-w-[140px]'} />
              </div>
            </Card>

            {/* Address */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">{t('checkout.address')}</h2>
              <p className="text-xs text-muted-foreground mb-6">Delivery address in Tbilisi</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.street')} *</label>
                  <input value={form.street} onChange={e => updateField('street', e.target.value)} className={inputCls('street')} placeholder="Rustaveli Avenue" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.building')} *</label>
                  <input value={form.building} onChange={e => updateField('building', e.target.value)} className={inputCls('building')} placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.apartment')}</label>
                  <input value={form.apartment} onChange={e => updateField('apartment', e.target.value)} className={inputCls('apartment')} placeholder="Apt 5" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.addressNotes')}</label>
                  <input value={form.addressNotes} onChange={e => updateField('addressNotes', e.target.value)} className={inputCls('addressNotes')} placeholder="Floor 3, ring bell twice" />
                </div>
              </div>
            </Card>

            {/* Inventory */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">{t('checkout.inventory')}</h2>
              <p className="text-xs text-muted-foreground mb-6">{t('checkout.inventoryNote')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inventoryKeys.map(key => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4 hover:border-border hover:shadow-sm transition-all">
                    <span className="text-sm font-medium">{t(`checkout.inventoryItems.${key}`)}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateInventory(key, inventory[key] - 1)} className="h-8 w-8 rounded-lg border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors shadow-sm">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{inventory[key]}</span>
                      <button type="button" onClick={() => updateInventory(key, inventory[key] + 1)} className="h-8 w-8 rounded-lg border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors shadow-sm">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Services */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">{t('checkout.services')}</h2>
              <p className="text-xs text-muted-foreground mb-6">Optional professional services</p>
              <div className="space-y-4">
                <label className="flex items-start gap-4 cursor-pointer rounded-xl border border-border/60 bg-background/50 p-4 hover:border-border hover:shadow-sm transition-all">
                  <input type="checkbox" checked={services.setup} onChange={e => setServices(s => ({ ...s, setup: e.target.checked }))} className="mt-0.5 h-5 w-5 rounded-md border-border accent-primary" />
                  <span className="text-sm font-medium flex-1">{t('checkout.setup')}</span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer rounded-xl border border-border/60 bg-background/50 p-4 hover:border-border hover:shadow-sm transition-all">
                  <input type="checkbox" checked={services.serving} onChange={e => setServices(s => ({ ...s, serving: e.target.checked }))} className="mt-0.5 h-5 w-5 rounded-md border-border accent-primary" />
                  <span className="text-sm font-medium flex-1">{t('checkout.serving')}</span>
                </label>
              </div>
            </Card>

            {/* Notes */}
            <Card className="rounded-2xl border-border/60 shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <h2 className="font-heading text-2xl font-bold mb-2 tracking-tight">Additional Information</h2>
              <p className="text-xs text-muted-foreground mb-6">Let us know about any special requirements</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.dietary')}</label>
                  <textarea value={form.dietary} onChange={e => updateField('dietary', e.target.value)} rows={3} className={inputCls('dietary') + ' resize-none'} placeholder="Allergies, dietary restrictions..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">{t('checkout.comments')}</label>
                  <textarea value={form.comments} onChange={e => updateField('comments', e.target.value)} rows={3} className={inputCls('comments') + ' resize-none'} placeholder="Any special requests or notes..." />
                </div>
              </div>
            </Card>

            {/* Privacy */}
            <Card className={`rounded-2xl border shadow-md p-6 transition-all ${errors.privacy ? 'border-destructive bg-destructive/5' : 'border-border/60 bg-card'}`}>
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" checked={form.privacy} onChange={e => updateField('privacy', e.target.checked)} className="mt-0.5 h-5 w-5 rounded-md border-border accent-primary" />
                <span className={`text-sm font-medium ${errors.privacy ? 'text-destructive' : 'text-foreground'}`}>{t('checkout.privacy')} *</span>
              </label>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-border/60 shadow-lg sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 border-b border-border/50">
                <h3 className="font-heading text-2xl font-bold tracking-tight">{t('checkout.orderSummary')}</h3>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Cart Items */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    {items.map(item => {
                      const p = getProduct(item.productId);
                      if (!p) return null;
                      return (
                        <div key={item.productId} className="flex justify-between items-start gap-3 py-2">
                          <span className="text-sm text-muted-foreground flex-1 leading-relaxed">
                            {(p.name[lang] || p.name.en)} <span className="font-semibold text-foreground">×{item.quantity}</span>
                          </span>
                          <span className="font-semibold text-sm whitespace-nowrap">{(p.price * item.quantity).toFixed(2)}₾</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">{t('checkout.foodSubtotal')}</span>
                    <span className="font-semibold">{cartSubtotal.toFixed(2)}₾</span>
                  </div>
                  {inventorySubtotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">{t('checkout.inventorySubtotal')}</span>
                      <span className="font-semibold">{inventorySubtotal.toFixed(2)}₾</span>
                    </div>
                  )}
                  {servicesTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">{t('checkout.servicesSubtotal')}</span>
                      <span className="font-semibold">{servicesTotal.toFixed(2)}₾</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">{t('cart.delivery')}</span>
                    <span className="font-semibold">{deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}₾`}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Grand Total */}
                <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-primary/5">
                  <span className="font-bold text-lg">{t('cart.total')}</span>
                  <span className="font-bold text-2xl text-primary">{grandTotal.toFixed(2)}₾</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-accent text-neutral-900 hover:bg-accent/90 hover:shadow-xl transition-all duration-200 active:scale-95 py-6 text-base font-bold disabled:opacity-50"
                  size="lg"
                >
                  {submitting ? t('common.loading') : t('checkout.submit')}
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
