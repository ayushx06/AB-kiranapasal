import { Languages, LogIn, LogOut, Menu, ShoppingCart, Store, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

export const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.itemCount());
  const { language, toggleLanguage, toggleCart, toggleMobileMenu } = useUiStore();
  const { user, profile, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex min-w-0 items-center gap-2 font-extrabold text-slate-950">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Store className="h-5 w-5" />
          </span>
          <span className="hidden truncate sm:block">Abhishek Kirana Pasal</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 md:flex">
          <NavLink className={navClass} to="/">{t('nav.home')}</NavLink>
          <NavLink className={navClass} to="/products">{t('nav.products')}</NavLink>
          <NavLink className={navClass} to="/orders">{t('nav.orders')}</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button variant="ghost" onClick={toggleLanguage} className="hidden sm:flex">
            <Languages className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => navigate('/orders')}
                className="flex max-w-48 items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{profile?.name || 'My Account'}</span>
              </button>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="hidden border-brand-200 text-brand-600 hover:bg-brand-50 md:flex"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}

          <Button className="relative h-10 w-10 bg-brand-500 p-0 hover:bg-brand-600" onClick={toggleCart} aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
