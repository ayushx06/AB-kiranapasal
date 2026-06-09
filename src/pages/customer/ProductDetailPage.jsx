import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { fetchProduct } from '../../firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { formatCurrency, getDiscountedPrice } from '../../utils/formatters';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { language } = useUiStore();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct(id).then((item) => {
      setProduct(item);
      setImage(item?.images?.[0] || '');
    });
  }, [id]);

  if (!product) return <Spinner />;
  const price = getDiscountedPrice(product);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-2 md:px-6">
      <div>
        <img className="aspect-square w-full rounded-lg bg-white object-cover shadow-sm" src={image} alt={product.name} />
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {product.images?.map((src) => <button key={src} onClick={() => setImage(src)}><img className="h-20 w-20 rounded-lg object-cover" src={src} alt="" /></button>)}
        </div>
      </div>
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-950">{language === 'ne' ? product.nameNe : product.name}</h1>
        <p className="mt-1 text-lg font-semibold text-slate-600">{product.nameNe}</p>
        <div className="mt-4 text-2xl font-extrabold text-brand-600">{formatCurrency(price, language)}</div>
        {product.originalPrice > price && <div className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice, language)}</div>}
        <div className="mt-4 text-sm font-semibold text-slate-600">Stock: {product.stock} {product.unit}</div>
        <div className="mt-5 flex items-center gap-3">
          <button className="rounded-lg border p-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></button>
          <span className="w-10 text-center text-lg font-bold">{quantity}</span>
          <button className="rounded-lg border p-2" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></button>
          <Button onClick={() => { addItem(product, quantity); toast.success('Added to cart'); }}>Add to cart</Button>
        </div>
        <p className="mt-6 leading-7 text-slate-600">{language === 'ne' ? product.descriptionNe : product.description}</p>
      </section>
    </main>
  );
};
