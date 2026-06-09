import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fetchDeliveryZones, createOrder, listenShopSettings } from '../../firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { makeOrderId } from '../../utils/helpers';
import { getZoneCharge } from '../../services/delivery';
import { downloadInvoice } from '../../services/invoice';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language } = useUiStore();
  const { items, subtotal, clearCart } = useCartStore();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [zones, setZones] = useState([]);
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [zoneId, setZoneId] = useState('');
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', landmark: '', city: 'Pokhara' });

  useEffect(() => listenShopSettings(setSettings), []);
  useEffect(() => { fetchDeliveryZones().then(setZones); }, []);

  const selectedZone = zones.find((zone) => zone.id === zoneId) || zones[0];
  const deliveryCharge = deliveryType === 'home_delivery' ? getZoneCharge(selectedZone, subtotal(), settings) : 0;
  const total = subtotal() + deliveryCharge;
  const canOrder = items.length && total >= Number(settings.minOrderAmount || 0);

  const orderPreview = useMemo(() => ({
    id: makeOrderId(),
    customerId: user?.uid || 'guest',
    customerPhone: user?.phoneNumber || address.phone,
    customerName: address.fullName || 'Customer',
    items,
    subtotal: subtotal(),
    deliveryCharge,
    discount: 0,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    deliveryType,
    deliveryAddress: deliveryType === 'home_delivery' ? { ...address, distanceKm: selectedZone?.distanceKm || 0 } : null,
    orderStatus: 'pending',
    invoiceUrl: null,
    notes: ''
  }), [address, deliveryCharge, deliveryType, items, paymentMethod, selectedZone?.distanceKm, subtotal, total, user]);

  const placeOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!canOrder) {
      toast.error(`Minimum order is ${formatCurrency(settings.minOrderAmount, language)}`);
      return;
    }
    const id = await createOrder(orderPreview);
    clearCart();
    toast.success('Order placed');
    downloadInvoice({ ...orderPreview, id }, language);
    navigate(`/orders/${id}`);
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 md:grid-cols-[1fr_360px] md:px-6">
      <section className="space-y-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="font-extrabold text-slate-950">1. Delivery</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ['pickup', 'Pickup from shop'],
              ['home_delivery', 'Home delivery']
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded-lg border p-3 font-semibold">
                <input type="radio" checked={deliveryType === value} onChange={() => setDeliveryType(value)} />
                {label}
              </label>
            ))}
          </div>
          {deliveryType === 'home_delivery' && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input label="Full name" value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} />
              <Input label="Phone" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} />
              <Input label="Street" value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} />
              <Input label="Landmark" value={address.landmark} onChange={(event) => setAddress({ ...address, landmark: event.target.value })} />
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Delivery zone</span>
                <select className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3" value={zoneId} onChange={(event) => setZoneId(event.target.value)}>
                  {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} - {formatCurrency(getZoneCharge(zone, subtotal(), settings), language)}</option>)}
                </select>
              </label>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="font-extrabold text-slate-950">2. Payment</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {['cod', 'bank_transfer', 'esewa', 'khalti'].map((method) => (
              <label key={method} className="flex items-center gap-2 rounded-lg border p-3 font-semibold">
                <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                {method.replace('_', ' ').toUpperCase()}
              </label>
            ))}
          </div>
          {paymentMethod === 'bank_transfer' && <p className="mt-3 rounded-lg bg-brand-50 p-3 text-sm font-medium text-slate-700">Bank transfer details can be configured from shop settings before launch.</p>}
        </div>
      </section>
      <aside className="h-fit rounded-lg bg-white p-4 shadow-sm">
        <h2 className="font-extrabold text-slate-950">3. Review</h2>
        <div className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity, language)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t pt-4 text-sm font-semibold">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal(), language)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(deliveryCharge, language)}</span></div>
          <div className="flex justify-between text-lg"><span>Total</span><span>{formatCurrency(total, language)}</span></div>
        </div>
        <Button className="mt-4 w-full" onClick={placeOrder}>Place order</Button>
      </aside>
    </main>
  );
};
