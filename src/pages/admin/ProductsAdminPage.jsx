import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ProductForm } from '../../components/admin/ProductForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CategoryFilter } from '../../components/customer/CategoryFilter';
import { removeProduct, saveProduct } from '../../firebase/firestore';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';

export const ProductsAdminPage = () => {
  const { products, setProducts } = useProducts();
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => products.filter((product) => !category || product.category === category), [category, products]);

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
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-950">Products</h1>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add product</Button>
      </div>
      <CategoryFilter value={category} onChange={setCategory} />
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-100 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                <td className={`px-4 py-3 font-semibold ${product.stock <= product.lowStockThreshold ? 'text-amber-700' : ''}`}>{product.stock}</td>
                <td className="px-4 py-3">{product.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" className="h-9 w-9 p-0" onClick={() => { setEditing(product); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="danger" className="h-9 w-9 p-0" onClick={() => deleteProduct(product)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} title={editing ? 'Edit product' : 'Add product'} onClose={() => setOpen(false)}>
        <ProductForm product={editing} onSubmit={save} onCancel={() => setOpen(false)} />
      </Modal>
    </main>
  );
};
