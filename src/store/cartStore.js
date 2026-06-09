import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDiscountedPrice } from '../utils/formatters';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                nameNe: product.nameNe,
                price: getDiscountedPrice(product),
                originalPrice: product.originalPrice || product.price,
                quantity,
                unit: product.unit,
                imageUrl: product.images?.[0] || ''
              }
            ]
          };
        }),
      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.productId !== productId)
            : state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    { name: 'akp-cart' }
  )
);
