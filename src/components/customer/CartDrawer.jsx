import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, language } = useUiStore();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40" onClick={closeCart}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <ShoppingBag className="h-5 w-5 text-brand-500" />
            Cart
          </div>
          <button onClick={closeCart} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {!items.length && <p className="rounded-lg bg-brand-50 p-4 text-sm font-medium text-slate-600">Your cart is empty.</p>}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 rounded-lg border border-slate-100 p-3">
                <img className="h-16 w-16 rounded-md object-cover" src={item.imageUrl} alt={item.name} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">{language === 'ne' ? item.nameNe : item.name}</div>
                  <div className="text-sm text-slate-500">{formatCurrency(item.price, language)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="rounded-md border p-1" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="rounded-md border p-1" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button className="ml-auto rounded-md p-1 text-red-600" onClick={() => removeItem(item.productId)} aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(subtotal(), language)}</span>
          </div>
          <Button as={Link} to="/checkout" className="w-full" onClick={closeCart}>Proceed to checkout</Button>
        </div>
      </aside>
    </div>
  );
};
