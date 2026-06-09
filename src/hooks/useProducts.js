import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchProducts, listenProducts } from '../firebase/firestore';
import { SAMPLE_PRODUCTS } from '../utils/constants';

export const useProducts = ({ realtime = false } = {}) => {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    const load = async () => {
      setLoading(true);
      try {
        if (realtime) {
          unsubscribe = listenProducts((items) => {
            setProducts(items.length ? items : SAMPLE_PRODUCTS);
            setLoading(false);
          });
        } else {
          setProducts(await fetchProducts());
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setProducts(SAMPLE_PRODUCTS);
        setLoading(false);
      }
    };
    load();
    return () => unsubscribe?.();
  }, [realtime]);

  const activeProducts = useMemo(() => products.filter((product) => product.isActive !== false), [products]);
  return { products: activeProducts, loading, setProducts };
};
