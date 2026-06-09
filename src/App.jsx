import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoutes } from 'react-router-dom';
import { BottomNav } from './components/layout/BottomNav';
import { CartDrawer } from './components/customer/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Toast } from './components/ui/Toast';
import { listenToAuth } from './firebase/auth';
import routes from './routes';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';

export default function App() {
  const element = useRoutes(routes);
  const { i18n } = useTranslation();
  const { language } = useUiStore();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => listenToAuth((user) => setUser(user)), [setUser]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.body.classList.toggle('font-nepali', language === 'ne');
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <>
      <Navbar />
      {element}
      <Footer />
      <BottomNav />
      <CartDrawer />
      <Toast />
    </>
  );
}
