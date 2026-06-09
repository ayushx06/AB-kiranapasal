import { ProductCard } from './ProductCard';

export const DiscountSection = ({ title, products }) => {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
};
