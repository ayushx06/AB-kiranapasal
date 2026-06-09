import { Loader2 } from 'lucide-react';

export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex min-h-32 items-center justify-center gap-2 text-sm font-medium text-slate-500">
    <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
    {label}
  </div>
);
