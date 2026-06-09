import { Download, Filter, PackageCheck, Search, ShoppingBag, Truck, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { updateOrderStatus } from '../../firebase/firestore';
import { Button } from '../../components/ui/Button';
import { useOrders } from '../../hooks/useOrders';
import { ORDER_STATUSES, PAYMENT_METHODS, STATUS_META } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportRowsToCsv } from '../../utils/helpers';

export const OrdersAdminPage = () => {
  const { orders } = useOrders(null, { admin: true });
  const [status, setStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => orders.filter((order) => {
    const searchable = `${order.id || ''} ${order.customerName || ''} ${order.customerPhone || ''}`.toLowerCase();
    return (!status || order.orderStatus === status)
      && (!paymentMethod || order.paymentMethod === paymentMethod)
      && (!query || searchable.includes(query.toLowerCase()));
  }), [orders, paymentMethod, query, status]);

  const filteredRevenue = filtered.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingCount = filtered.filter((order) => order.orderStatus === 'pending').length;
  const deliveryCount = filtered.filter((order) => order.orderStatus === 'on_the_way').length;

  return (
    <main className="min-h-screen flex-1 bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track live demand, fulfillment status, and payment flow.</p>
        </div>
        <Button
          variant="secondary"
          className="rounded-xl"
          onClick={() => exportRowsToCsv('orders.csv', filtered.map((order) => ({
            id: order.id,
            customer: order.customerName,
            phone: order.customerPhone,
            total: order.total,
            status: order.orderStatus,
            paymentMethod: order.paymentMethod
          })))}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Orders</p>
            <ShoppingBag className="h-5 w-5 text-brand-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{filtered.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Revenue</p>
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{formatCurrency(filteredRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Pending</p>
            <PackageCheck className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">On The Way</p>
            <Truck className="h-5 w-5 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{deliveryCount}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customer, phone, or order ID"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <select className="h-11 bg-transparent text-sm font-semibold text-slate-700 outline-none" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((item) => <option key={item} value={item}>{STATUS_META[item].label}</option>)}
            </select>
          </div>
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="">All payments</option>
            {PAYMENT_METHODS.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const meta = STATUS_META[order.orderStatus] || STATUS_META.pending;

                return (
                  <tr key={order.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="max-w-40 truncate font-bold text-slate-900">{order.id}</p>
                      <p className="text-xs text-slate-400">{order.items?.length || 0} items</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{order.customerName || 'Customer'}</p>
                      <p className="text-xs text-slate-400">{order.customerPhone || 'No phone'}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                        {(order.paymentMethod || 'cod').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}>{meta.label}</span>
                        <select
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100"
                          value={order.orderStatus}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                        >
                          {ORDER_STATUSES.map((item) => <option key={item} value={item}>{STATUS_META[item].label}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-medium text-slate-400">No orders match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
