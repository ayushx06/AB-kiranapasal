import { ProductCard } from './ProductCard';

export const PopularSection = ({ title, products }) => (
  <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {products.map((product) => (
        <div key={product.id} className="w-56 shrink-0">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  </section>
);
