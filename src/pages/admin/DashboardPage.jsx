import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Star,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SalesChart } from '../../components/admin/SalesChart';
import { fetchCustomers, listenShopSettings, updateOrderStatus, updateShopSettings } from '../../firebase/firestore';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  on_the_way: { label: 'On the way', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const toDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
};

const LuxuryStatCard = ({ icon: Icon, label, value, change, color }) => {
  const TrendIcon = change >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
          {change !== undefined && (
            <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <TrendIcon className="h-3 w-3" />
              {change >= 0 ? '+' : ''}{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${color} opacity-10`} />
    </div>
  );
};

export const DashboardPage = () => {
  const { orders } = useOrders(null, { admin: true });
  const { products } = useProducts();
  const [customers, setCustomers] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => { fetchCustomers().then(setCustomers).catch(() => setCustomers([])); }, []);
  useEffect(() => listenShopSettings(setSettings), []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((order) => toDate(order.createdAt)?.toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter((order) => order.orderStatus === 'pending');
  const lowStock = products.filter((product) => Number(product.stock) <= Number(product.lowStockThreshold || 5));

  const bestSelling = useMemo(() => {
    const productMap = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId || item.id || item.name;
        if (!productMap[key]) productMap[key] = { name: item.name, units: 0, revenue: 0 };
        productMap[key].units += Number(item.quantity || 0);
        productMap[key].revenue += Number(item.price || 0) * Number(item.quantity || 0);
      });
    });
    return Object.values(productMap).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [orders]);

  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => ({
      day,
      revenue: orders
        .filter((order) => toDate(order.createdAt)?.getDay() === index)
        .reduce((sum, order) => sum + Number(order.total || 0), 0)
    }));
  }, [orders]);

  return (
    <main className="min-h-screen flex-1 bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">A live command center for orders, inventory, and revenue.</p>
        </div>
        <button
          onClick={() => updateShopSettings({ isOpen: !settings.isOpen })}
          className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition-all ${
            settings.isOpen
              ? 'bg-green-500 text-white shadow-green-200 hover:bg-green-600'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {settings.isOpen ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
          Shop is {settings.isOpen ? 'OPEN' : 'CLOSED'}
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LuxuryStatCard icon={ShoppingBag} label="Today's Orders" value={todayOrders.length} change={12} color="bg-brand-500" />
        <LuxuryStatCard icon={Banknote} label="Today's Revenue" value={formatCurrency(todayRevenue)} change={8} color="bg-emerald-500" />
        <LuxuryStatCard icon={Users} label="Total Customers" value={customers.length} change={5} color="bg-violet-500" />
        <LuxuryStatCard icon={PackageCheck} label="Pending Orders" value={pendingOrders.length} change={-3} color="bg-amber-500" />
      </div>

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-400 p-6 text-white shadow-lg shadow-brand-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Total all-time revenue</p>
        <p className="mt-1 text-4xl font-extrabold">{formatCurrency(totalRevenue)}</p>
        <p className="mt-1 text-sm text-white/80">Across {orders.length} total orders from {customers.length} customers.</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <SalesChart data={chartData} />

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-900">Best Selling</h2>
          </div>
          <div className="space-y-3">
            {bestSelling.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No sales data yet.</p>}
            {bestSelling.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.units} units sold</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-bold text-slate-900">Low Stock</h2>
            {lowStock.length > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                {lowStock.length}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-green-700">All products are well stocked.</p>
              </div>
            )}
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3">
                <span className="max-w-[180px] truncate text-sm font-semibold text-red-800">{product.name}</span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">{product.stock} left</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Orders</h2>
          <div className="space-y-3">
            {orders.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No orders yet.</p>}
            {orders.slice(0, 8).map((order) => {
              const status = statusConfig[order.orderStatus] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{order.customerName || order.customerPhone || 'Customer'}</p>
                    <p className="text-xs text-slate-400">{order.items?.length || 0} items - {formatCurrency(order.total)}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  <select
                    value={order.orderStatus}
                    onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    {Object.entries(statusConfig).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};
