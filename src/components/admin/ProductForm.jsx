import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../../utils/constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: product?.name || '',
      nameNe: product?.nameNe || '',
      description: product?.description || '',
      descriptionNe: product?.descriptionNe || '',
      category: product?.category || CATEGORIES[0].id,
      price: product?.price || 0,
      originalPrice: product?.originalPrice || 0,
      discountPercent: product?.discountPercent || 0,
      unit: product?.unit || 'packet',
      stock: product?.stock || 0,
      lowStockThreshold: product?.lowStockThreshold || 10,
      images: product?.images || [],
      isPopular: product?.isPopular || false,
      isFeatured: product?.isFeatured || false,
      isActive: product?.isActive ?? true
    }
  });
  const images = watch('images') || [];

  const addImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setValue('images', [...images, trimmed]);
    setNewImageUrl('');
  };

  const submit = (values) => onSubmit({
    ...product,
    ...values,
    price: Number(values.price),
    originalPrice: Number(values.originalPrice || values.price),
    discountPercent: Number(values.discountPercent || 0),
    stock: Number(values.stock || 0),
    lowStockThreshold: Number(values.lowStockThreshold || 10)
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Name (EN)" {...register('name', { required: true })} />
        <Input label="Name (NE)" {...register('nameNe', { required: true })} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Description (EN)</span>
          <textarea className="min-h-24 w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-brand-500" {...register('description')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Description (NE)</span>
          <textarea className="min-h-24 w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-brand-500" {...register('descriptionNe')} />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
          <select className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3" {...register('category')}>
            {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
        </label>
        <Input label="Unit" {...register('unit')} />
        <Input label="Stock" type="number" {...register('stock')} />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Input label="Price" type="number" {...register('price')} />
        <Input label="Original price" type="number" {...register('originalPrice')} />
        <Input label="Discount %" type="number" {...register('discountPercent')} />
        <Input label="Low stock threshold" type="number" {...register('lowStockThreshold')} />
      </div>
      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">Image URL</span>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
            className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addImage(); }
            }}
          />
          <button
            type="button"
            onClick={addImage}
            className="h-11 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Add
          </button>
        </div>
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} className="h-20 w-20 rounded-lg object-cover border border-slate-200" alt="" />
                <button
                  type="button"
                  onClick={() => setValue('images', images.filter((_, j) => j !== i))}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {['isPopular', 'isFeatured', 'isActive'].map((field) => (
          <label key={field} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" {...register(field)} />
            {field}
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>Save product</Button>
      </div>
    </form>
  );
};
