import { Home, LayoutDashboard, LogOut, Package, ShoppingBag, Store, Truck, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery', label: 'Delivery', icon: Truck }
];

export const AdminSidebar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-slate-900 text-white shadow-xl md:h-screen md:w-64">
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-900/30">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-tight text-white">Abhishek Kirana</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-4 md:flex-1 md:flex-col md:space-y-1 md:overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex gap-2 border-t border-slate-700/50 px-3 py-4 md:flex-col md:space-y-1">
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
        >
          <Home className="h-5 w-5" />
          View Store
        </NavLink>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-900/20 hover:text-red-300 md:w-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
