import { useMemo, useState } from 'react';
import { CategoryFilter } from '../../components/customer/CategoryFilter';
import { ProductCard } from '../../components/customer/ProductCard';
import { SearchBar } from '../../components/customer/SearchBar';
import { Spinner } from '../../components/ui/Spinner';
import { useProducts } from '../../hooks/useProducts';

export const ProductsPage = () => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products
      .filter((product) => !category || product.category === category)
      .filter((product) => !query || `${product.name} ${product.nameNe}`.toLowerCase().includes(query))
      .sort((a, b) => {
        if (sort === 'price_low') return a.price - b.price;
        if (sort === 'price_high') return b.price - a.price;
        if (sort === 'popular') return Number(b.isPopular) - Number(a.isPopular);
        return 0;
      });
  }, [category, products, search, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="md:w-96">
          <SearchBar value={search} onChange={setSearch} resultCount={filtered.length} />
        </div>
        <select className="h-11 rounded-lg border border-slate-200 bg-white px-3" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price_low">Price low to high</option>
          <option value="price_high">Price high to low</option>
        </select>
      </div>
      <CategoryFilter value={category} onChange={setCategory} />
      {loading ? <Spinner /> : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </main>
  );
};
