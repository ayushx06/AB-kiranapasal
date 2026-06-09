import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SearchBar = ({ value, onChange, resultCount }) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(timer);
  }, [draft, onChange]);

  return (
    <div>
      <div className="flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input className="min-w-0 flex-1 outline-none" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t('product.search')} />
        {draft && (
          <button onClick={() => setDraft('')} aria-label="Clear search">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">{resultCount} results</p>
    </div>
  );
};
