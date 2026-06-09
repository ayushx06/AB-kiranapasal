import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

export const Button = ({ as: Component = 'button', children, className, variant = 'primary', loading = false, disabled, ...props }) => (
  <Component
    className={classNames(
      'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </Component>
);
