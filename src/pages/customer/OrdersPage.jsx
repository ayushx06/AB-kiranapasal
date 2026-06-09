import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../store/authStore';
import { STATUS_META } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrdersPage = () => {
  const { user } = useAuthStore();
  const { orders, loading } = useOrders(user?.uid);
  if (!user) return <main className="mx-auto max-w-3xl px-4 py-10">Please login to see your orders.</main>;
  if (loading) return <Spinner />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <h1 className="mb-5 text-2xl font-extrabold text-slate-950">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="block rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold">{order.id}</div>
              <Badge className={STATUS_META[order.orderStatus]?.className}>{STATUS_META[order.orderStatus]?.label}</Badge>
            </div>
            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>{formatDate(order.createdAt)}</span>
              <span className="font-bold text-slate-950">{formatCurrency(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};
