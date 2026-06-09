import { useMemo, useState } from 'react';
import { OrderTable } from '../../components/admin/OrderTable';
import { Button } from '../../components/ui/Button';
import { useOrders } from '../../hooks/useOrders';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../utils/constants';
import { exportRowsToCsv } from '../../utils/helpers';

export const OrdersAdminPage = () => {
  const { orders } = useOrders(null, { admin: true });
  const [status, setStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const filtered = useMemo(() => orders.filter((order) => (!status || order.orderStatus === status) && (!paymentMethod || order.paymentMethod === paymentMethod)), [orders, paymentMethod, status]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-950">Orders</h1>
        <Button variant="secondary" onClick={() => exportRowsToCsv('today-orders.csv', filtered.map((order) => ({ id: order.id, customer: order.customerName, total: order.total, status: order.orderStatus })))}>
          Export CSV
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="h-10 rounded-lg border px-3" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="h-10 rounded-lg border px-3" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
          <option value="">All payments</option>
          {PAYMENT_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <OrderTable orders={filtered} />
    </main>
  );
};
