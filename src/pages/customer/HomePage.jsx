import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BannerSlider } from '../../components/customer/BannerSlider';
import { CategoryFilter } from '../../components/customer/CategoryFilter';
import { DiscountSection } from '../../components/customer/DiscountSection';
import { PopularSection } from '../../components/customer/PopularSection';
import { ProductCard } from '../../components/customer/ProductCard';
import { WhatsAppButton } from '../../components/customer/WhatsAppButton';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { listenShopSettings } from '../../firebase/firestore';
import { useProducts } from '../../hooks/useProducts';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { useUiStore } from '../../store/uiStore';

export const HomePage = () => {
  const { t } = useTranslation();
  const { language } = useUiStore();
  const { products, loading } = useProducts();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const unsubscribe = listenShopSettings(setSettings);
    return unsubscribe;
  }, []);

  const filtered = category ? products.filter((product) => product.category === category) : products;

  return (
    <div>
      <BannerSlider images={settings.bannerImages} title="Abhishek Kirana Pasal" subtitle={t('home.slogan')} />
      <div className="mx-auto -mt-10 max-w-7xl px-4 md:px-6">
        <div className="relative rounded-lg bg-white p-4 shadow-soft">
          <Badge className={settings.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
            {settings.isOpen ? t('home.open') : `${t('home.closed')}. Opens ${settings.openTime}`}
          </Badge>
          <p className="mt-2 text-sm font-medium text-slate-600">{language === 'ne' ? settings.announcementTextNe : settings.announcementText}</p>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <h2 className="mb-4 text-xl font-bold text-slate-950">{t('home.categories')}</h2>
        <CategoryFilter value={category} onChange={setCategory} />
      </section>
      {loading ? <Spinner /> : (
        <>
          <PopularSection title={t('home.popular')} products={products.filter((product) => product.isPopular).slice(0, 8)} />
          <DiscountSection title={t('home.offers')} products={products.filter((product) => product.discountPercent > 0).slice(0, 8)} />
          <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            <h2 className="mb-4 text-xl font-bold text-slate-950">{t('home.all')}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        </>
      )}
      <WhatsAppButton settings={settings} />
    </div>
  );
};
