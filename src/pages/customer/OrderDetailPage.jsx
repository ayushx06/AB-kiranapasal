import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { ORDER_STATUSES, STATUS_META } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadInvoice } from '../../services/invoice';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { language } = useUiStore();
  const { orders } = useOrders(user?.uid);
  const order = useMemo(() => orders.find((item) => item.id === id), [id, orders]);

  if (!order) return <main className="mx-auto max-w-3xl px-4 py-10">Order loading or unavailable.</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">{order.id}</h1>
            <p className="text-sm text-slate-500">{formatDate(order.createdAt, language)}</p>
          </div>
          <Button onClick={() => downloadInvoice(order, language)}>Download invoice</Button>
        </div>
        <div className="mt-6 grid gap-2 md:grid-cols-5">
          {ORDER_STATUSES.filter((status) => status !== 'cancelled').map((status) => (
            <div key={status} className={`rounded-lg p-3 text-center text-xs font-bold ${ORDER_STATUSES.indexOf(status) <= ORDER_STATUSES.indexOf(order.orderStatus) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {STATUS_META[status].label}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between border-b border-slate-100 pb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity, language)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm font-semibold">
          <div className="flex justify-between"><span>Payment</span><span>{order.paymentMethod}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryType}</span></div>
          <div className="flex justify-between text-lg"><span>Total</span><span>{formatCurrency(order.total, language)}</span></div>
        </div>
      </div>
    </main>
  );
};
