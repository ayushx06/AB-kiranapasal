import { BarChart3, Bike, Boxes, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/orders', label: 'Orders', icon: BarChart3 },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery', label: 'Delivery', icon: Bike }
];

export const AdminSidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <aside className="border-b border-slate-200 bg-white p-3 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4 px-2 text-lg font-extrabold text-slate-950">Admin</div>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-brand-50'}`}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <button className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-brand-50" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
};
