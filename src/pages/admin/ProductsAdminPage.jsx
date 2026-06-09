import { AlertTriangle, CheckCircle2, Package, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ProductForm } from '../../components/admin/ProductForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { removeProduct, saveProduct } from '../../firebase/firestore';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const ProductsAdminPage = () => {
  const { products, setProducts } = useProducts();
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesQuery = !query || product.name?.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, products, query]);

  const lowStockCount = products.filter((product) => Number(product.stock) <= Number(product.lowStockThreshold || 5)).length;
  const activeCount = products.filter((product) => product.isActive).length;
  const inventoryValue = products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0);

  const save = async (product) => {
    const id = await saveProduct(product);
    setProducts((current) => {
      const next = { ...product, id };
      return current.some((item) => item.id === product.id) ? current.map((item) => (item.id === product.id ? next : item)) : [next, ...current];
    });
    setOpen(false);
    setEditing(null);
    toast.success('Product saved');
  };

  const deleteProduct = async (product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    await removeProduct(product.id);
    setProducts((current) => current.filter((item) => item.id !== product.id));
    toast.success('Product deleted');
  };

  return (
    <main className="min-h-screen flex-1 bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage inventory, pricing, visibility, and stock risk.</p>
        </div>
        <Button
          className="rounded-xl shadow-sm shadow-brand-200"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Active SKUs</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Inventory Value</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{formatCurrency(inventoryValue)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Low Stock Alerts</p>
          <p className={`mt-2 text-3xl font-extrabold ${lowStockCount ? 'text-red-600' : 'text-slate-900'}`}>{lowStockCount}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const isLowStock = Number(product.stock) <= Number(product.lowStockThreshold || 5);

                return (
                  <tr key={product.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.unit || 'unit'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isLowStock ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        product.isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {product.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          className="h-9 w-9 rounded-xl p-0"
                          onClick={() => {
                            setEditing(product);
                            setOpen(true);
                          }}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" className="h-9 w-9 rounded-xl p-0" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-slate-400">No products match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={open} title={editing ? 'Edit product' : 'Add product'} onClose={() => setOpen(false)}>
        <ProductForm product={editing} onSubmit={save} onCancel={() => setOpen(false)} />
      </Modal>
    </main>
  );
};
