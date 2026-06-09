import { Languages, Menu, ShoppingCart, Store } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';

const navClass = ({ isActive }) => `text-sm font-semibold ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

export const Navbar = () => {
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.itemCount());
  const { language, toggleLanguage, toggleCart, toggleMobileMenu } = useUiStore();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <button className="md:hidden" onClick={toggleMobileMenu} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex min-w-0 items-center gap-2 font-extrabold text-slate-950">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Store className="h-5 w-5" />
          </span>
          <span className="truncate">Abhishek Kirana Pasal</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 md:flex">
          <NavLink className={navClass} to="/">{t('nav.home')}</NavLink>
          <NavLink className={navClass} to="/products">{t('nav.products')}</NavLink>
          <NavLink className={navClass} to="/orders">{t('nav.orders')}</NavLink>
          <NavLink className={navClass} to="/admin">{t('nav.admin')}</NavLink>
        </nav>
        <Button variant="ghost" className="ml-auto md:ml-0" onClick={toggleLanguage}>
          <Languages className="h-4 w-4" />
          {language.toUpperCase()}
        </Button>
        <Button className="relative h-10 w-10 p-0" onClick={toggleCart} aria-label="Open cart">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-nepal-red px-1.5 text-xs text-white">{itemCount}</span>}
        </Button>
      </div>
    </header>
  );
};
