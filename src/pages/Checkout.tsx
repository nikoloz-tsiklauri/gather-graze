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
import { Minus, Plus, ShieldCheck } from 'lucide-react';

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
    `w-full h-12 rounded-xl border ${errors[key] ? 'border-destructive ring-2 ring-destructive/20' : 'border-neutral-200'} bg-white/80 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50/50 py-8 sm:py-12">
      <div className="container max-w-[1200px] px-4">
        {/* Header with Step Indicator */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t('checkout.title')}</h1>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                <span className="text-xs font-bold text-accent">✓</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:inline">Cart</span>
            </div>
            <div className="h-px w-8 sm:w-12 bg-neutral-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-accent flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Checkout</span>
            </div>
            <div className="h-px w-8 sm:w-12 bg-neutral-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
                <span className="text-xs font-medium text-neutral-400">3</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:inline">Complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-5">
            {/* Customer Information */}
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-5 tracking-tight">{t('checkout.customer')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.name')} *</label>
                  <input value={form.name} onChange={e => updateField('name', e.target.value)} className={inputCls('name')} placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.phone')} *</label>
                    <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls('phone')} placeholder="+995 555 123 456" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.email')} *</label>
                    <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} placeholder="email@example.com" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Event Details */}
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-5 tracking-tight">{t('checkout.event')}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.date')} *</label>
                    <input type="date" value={form.date} onChange={e => updateField('date', e.target.value)} className={inputCls('date')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.startTime')} *</label>
                    <input type="time" value={form.startTime} onChange={e => updateField('startTime', e.target.value)} className={inputCls('startTime')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.endTime')}</label>
                    <input type="time" value={form.endTime} onChange={e => updateField('endTime', e.target.value)} className={inputCls('endTime')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.guests')} *</label>
                  <input type="number" min="1" value={form.guests} onChange={e => updateField('guests', parseInt(e.target.value) || 1)} className={inputCls('guests') + ' max-w-[120px]'} />
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-5 tracking-tight">{t('checkout.address')}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.street')} *</label>
                    <input value={form.street} onChange={e => updateField('street', e.target.value)} className={inputCls('street')} placeholder="Rustaveli Avenue" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.building')} *</label>
                    <input value={form.building} onChange={e => updateField('building', e.target.value)} className={inputCls('building')} placeholder="15" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.apartment')}</label>
                    <input value={form.apartment} onChange={e => updateField('apartment', e.target.value)} className={inputCls('apartment')} placeholder="Apt 5" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.addressNotes')}</label>
                    <input value={form.addressNotes} onChange={e => updateField('addressNotes', e.target.value)} className={inputCls('addressNotes')} placeholder="Floor 3" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Extras & Rentals */}
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-1 tracking-tight">{t('checkout.inventory')}</h2>
              <p className="text-xs text-neutral-500 mb-5">{t('checkout.inventoryNote')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inventoryKeys.map(key => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 hover:border-neutral-300 transition-colors">
                    <span className="text-sm font-medium">{t(`checkout.inventoryItems.${key}`)}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateInventory(key, inventory[key] - 1)} className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
                        <Minus className="h-3.5 w-3.5 text-neutral-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{inventory[key]}</span>
                      <button type="button" onClick={() => updateInventory(key, inventory[key] + 1)} className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
                        <Plus className="h-3.5 w-3.5 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Services & Notes Combined */}
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-5 tracking-tight">{t('checkout.services')}</h2>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 hover:border-neutral-300 transition-colors">
                  <input type="checkbox" checked={services.setup} onChange={e => setServices(s => ({ ...s, setup: e.target.checked }))} className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent/40" />
                  <span className="text-sm font-medium flex-1">{t('checkout.setup')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 hover:border-neutral-300 transition-colors">
                  <input type="checkbox" checked={services.serving} onChange={e => setServices(s => ({ ...s, serving: e.target.checked }))} className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent/40" />
                  <span className="text-sm font-medium flex-1">{t('checkout.serving')}</span>
                </label>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.dietary')}</label>
                  <textarea value={form.dietary} onChange={e => updateField('dietary', e.target.value)} rows={2} className={inputCls('dietary') + ' resize-none h-auto'} placeholder="Allergies, dietary restrictions..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">{t('checkout.comments')}</label>
                  <textarea value={form.comments} onChange={e => updateField('comments', e.target.value)} rows={2} className={inputCls('comments') + ' resize-none h-auto'} placeholder="Any special requests..." />
                </div>
              </div>
            </Card>

            {/* Privacy Consent */}
            <div className={`rounded-xl border p-4 transition-all ${errors.privacy ? 'border-destructive bg-destructive/5' : 'border-neutral-200 bg-white'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.privacy} onChange={e => updateField('privacy', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent/40" />
                <span className={`text-xs leading-relaxed ${errors.privacy ? 'text-destructive font-medium' : 'text-neutral-600'}`}>{t('checkout.privacy')} *</span>
              </label>
            </div>
          </div>

          {/* Review Your Cart - Sidebar */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-neutral-200/80 shadow-sm bg-white sticky top-6 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-neutral-100">
                <h3 className="text-lg font-bold tracking-tight">Review your cart</h3>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                {/* Cart Items */}
                {items.length > 0 && (
                  <div className="space-y-4">
                    {items.map(item => {
                      const p = getProduct(item.productId);
                      if (!p) return null;
                      return (
                        <div key={item.productId} className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-tight">{(p.name[lang] || p.name.en)}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-sm whitespace-nowrap">{(p.price * item.quantity).toFixed(2)}₾</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Separator />

                {/* Totals Breakdown */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">{t('checkout.foodSubtotal')}</span>
                    <span className="font-medium">{cartSubtotal.toFixed(2)}₾</span>
                  </div>
                  {inventorySubtotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">{t('checkout.inventorySubtotal')}</span>
                      <span className="font-medium">{inventorySubtotal.toFixed(2)}₾</span>
                    </div>
                  )}
                  {servicesTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">{t('checkout.servicesSubtotal')}</span>
                      <span className="font-medium">{servicesTotal.toFixed(2)}₾</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">{t('cart.delivery')}</span>
                    <span className="font-medium">{deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}₾`}</span>
                  </div>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between items-center py-4 px-5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-base">{t('cart.total')}</span>
                  <span className="font-bold text-2xl">{grandTotal.toFixed(2)}₾</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-accent text-neutral-900 hover:bg-accent/90 hover:shadow-lg transition-all duration-200 font-bold disabled:opacity-50"
                >
                  {submitting ? t('common.loading') : t('checkout.submit')}
                </Button>

                {/* Secure Checkout Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
