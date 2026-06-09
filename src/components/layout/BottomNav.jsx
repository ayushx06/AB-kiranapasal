import { Home, ListOrdered, Search, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: Search, label: 'Search' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/orders', icon: ListOrdered, label: 'Orders' },
  { to: '/login', icon: User, label: 'Profile' }
];

export const BottomNav = () => {
  const itemCount = useCartStore((state) => state.itemCount());
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `relative flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-semibold ${isActive ? 'text-brand-600' : 'text-slate-500'}`}>
            <Icon className="h-5 w-5" />
            <span>{label}</span>
            {to === '/cart' && itemCount > 0 && <span className="absolute right-4 top-1 rounded-full bg-nepal-red px-1 text-[10px] text-white">{itemCount}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
