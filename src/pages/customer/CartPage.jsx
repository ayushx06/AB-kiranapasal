import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/formatters';

export const CartPage = () => {
  const { language } = useUiStore();
  const { items, subtotal, updateQuantity, removeItem } = useCartStore();

  if (!items.length) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-extrabold text-slate-950">Your cart is empty</h1>
        <Button as={Link} to="/products" className="mt-4">Start shopping</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <h1 className="mb-5 text-2xl font-extrabold text-slate-950">Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 rounded-lg bg-white p-3 shadow-sm">
            <img className="h-20 w-20 rounded-lg object-cover" src={item.imageUrl} alt={item.name} />
            <div className="flex-1">
              <div className="font-bold">{language === 'ne' ? item.nameNe : item.name}</div>
              <div className="text-sm text-slate-500">{formatCurrency(item.price, language)}</div>
              <div className="mt-3 flex items-center gap-2">
                <button className="rounded-md border p-1" onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button className="rounded-md border p-1" onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                <button className="ml-auto text-red-600" onClick={() => removeItem(item.productId)}><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex justify-between text-lg font-extrabold">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal(), language)}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Delivery is calculated at checkout.</p>
        <Button as={Link} to="/checkout" className="mt-4 w-full">Proceed to checkout</Button>
      </div>
    </main>
  );
};
