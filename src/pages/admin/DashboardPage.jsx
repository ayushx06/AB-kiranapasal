import { Banknote, PackageCheck, ShoppingBag, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SalesChart } from '../../components/admin/SalesChart';
import { StatsCard } from '../../components/admin/StatsCard';
import { OrderTable } from '../../components/admin/OrderTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { fetchCustomers, updateShopSettings, listenShopSettings } from '../../firebase/firestore';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const DashboardPage = () => {
  const { orders } = useOrders(null, { admin: true });
  const { products } = useProducts();
  const [customers, setCustomers] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => { fetchCustomers().then(setCustomers).catch(() => setCustomers([])); }, []);
  useEffect(() => listenShopSettings(setSettings), []);

  const pending = orders.filter((order) => order.orderStatus === 'pending');
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock) <= Number(product.lowStockThreshold || 0));
  const chartData = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({
    day,
    revenue: orders.filter((_, orderIndex) => orderIndex % 7 === index).reduce((sum, order) => sum + Number(order.total || 0), 0)
  })), [orders]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-950">Dashboard</h1>
        <Button variant={settings.isOpen ? 'primary' : 'secondary'} onClick={() => updateShopSettings({ isOpen: !settings.isOpen })}>
          {settings.isOpen ? 'Shop open' : 'Shop closed'}
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <StatsCard icon={ShoppingBag} label="Today's orders" value={orders.length} change={12} />
        <StatsCard icon={Banknote} label="Today's revenue" value={formatCurrency(revenue)} change={8} />
        <StatsCard icon={Users} label="Total customers" value={customers.length} change={5} />
        <StatsCard icon={PackageCheck} label="Pending orders" value={pending.length} change={-3} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <SalesChart data={chartData} />
        <Card>
          <h2 className="mb-3 text-lg font-bold">Low stock alerts</h2>
          <div className="space-y-2">
            {lowStock.map((product) => (
              <div key={product.id} className="flex justify-between rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                <span>{product.name}</span>
                <span>{product.stock} left</span>
              </div>
            ))}
            {!lowStock.length && <p className="text-sm text-slate-500">No low stock products.</p>}
          </div>
        </Card>
      </div>
      <section className="mt-5">
        <h2 className="mb-3 text-lg font-bold text-slate-950">Recent orders</h2>
        <OrderTable orders={orders.slice(0, 10)} />
      </section>
    </main>
  );
};
