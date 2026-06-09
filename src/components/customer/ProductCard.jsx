import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { formatCurrency, getDiscountedPrice, toDevanagariNumber } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { language } = useUiStore();
  const addItem = useCartStore((state) => state.addItem);
  const price = getDiscountedPrice(product);
  const lowStock = Number(product.stock) <= Math.max(5, Number(product.lowStockThreshold || 0));

  const add = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
      <Link to={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-brand-50">
        <img className="h-full w-full object-cover transition hover:scale-105" src={product.images?.[0]} alt={product.name} loading="lazy" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.id}`} className="font-semibold leading-snug text-slate-900 hover:text-brand-600">
            {language === 'ne' ? product.nameNe : product.name}
          </Link>
          {product.discountPercent > 0 && <Badge className="bg-red-100 text-red-700">{product.discountPercent}% OFF</Badge>}
        </div>
        <div className="text-xs text-slate-500">{product.unit}</div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-bold text-slate-950">{formatCurrency(price, language)}</div>
            {product.originalPrice > price && (
              <div className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice, language)}</div>
            )}
            {lowStock && (
              <div className="mt-1 text-xs font-semibold text-amber-700">
                {t('product.stockLow', { count: language === 'ne' ? toDevanagariNumber(product.stock) : product.stock })}
              </div>
            )}
          </div>
          <Button className="h-10 w-10 shrink-0 p-0" onClick={add} aria-label={`Add ${product.name}`}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};
