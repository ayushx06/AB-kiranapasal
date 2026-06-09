import { ORDER_STATUSES, STATUS_META } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { updateOrderStatus } from '../../firebase/firestore';
import { Badge } from '../ui/Badge';

export const OrderTable = ({ orders }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-4 py-3">Order</th>
          <th className="px-4 py-3">Customer</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t border-slate-100">
            <td className="px-4 py-3 font-semibold">{order.id}</td>
            <td className="px-4 py-3">{order.customerName || order.customerPhone}</td>
            <td className="px-4 py-3">{formatCurrency(order.total)}</td>
            <td className="px-4 py-3">
              <select className="rounded-md border px-2 py-1" value={order.orderStatus} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{STATUS_META[status].label}</option>)}
              </select>
            </td>
            <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
