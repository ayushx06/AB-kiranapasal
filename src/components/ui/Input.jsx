import { classNames } from '../../utils/helpers';

export const Input = ({ label, error, className, ...props }) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
    <input
      className={classNames(
        'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
        className
      )}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);
