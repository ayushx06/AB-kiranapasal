import { create } from 'zustand';
import i18n from '../i18n';

export const useUiStore = create((set, get) => ({
  language: localStorage.getItem('akp-language') || 'en',
  isCartOpen: false,
  isMobileMenuOpen: false,
  toggleLanguage: () => {
    const next = get().language === 'en' ? 'ne' : 'en';
    localStorage.setItem('akp-language', next);
    i18n.changeLanguage(next);
    set({ language: next });
  },
  setLanguage: (language) => {
    localStorage.setItem('akp-language', language);
    i18n.changeLanguage(language);
    set({ language });
  },
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
}));
