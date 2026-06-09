import { formatCurrency, formatDate } from '../../utils/formatters';

export const CustomerTable = ({ customers }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-4 py-3">Phone</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Orders</th>
          <th className="px-4 py-3">Spent</th>
          <th className="px-4 py-3">Last order</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} className="border-t border-slate-100">
            <td className="px-4 py-3 font-semibold">{customer.phone}</td>
            <td className="px-4 py-3">{customer.name || 'Customer'}</td>
            <td className="px-4 py-3">{customer.totalOrders || 0}</td>
            <td className="px-4 py-3">{formatCurrency(customer.totalSpent || 0)}</td>
            <td className="px-4 py-3">{formatDate(customer.lastOrderAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
