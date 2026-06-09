import { CATEGORIES } from '../../utils/constants';
import { classNames } from '../../utils/helpers';
import { useUiStore } from '../../store/uiStore';

export const CategoryFilter = ({ value, onChange, includeAll = true }) => {
  const { language } = useUiStore();
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {includeAll && (
        <button
          className={classNames('shrink-0 rounded-full px-4 py-2 text-sm font-semibold', !value ? 'bg-brand-500 text-white' : 'bg-white text-slate-700')}
          onClick={() => onChange('')}
        >
          {language === 'ne' ? 'सबै' : 'All'}
        </button>
      )}
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          className={classNames(
            'shrink-0 rounded-full px-4 py-2 text-sm font-semibold',
            value === category.id ? 'bg-brand-500 text-white' : 'bg-white text-slate-700'
          )}
          onClick={() => onChange(category.id)}
        >
          <span className="mr-2">{category.icon}</span>
          {language === 'ne' ? category.labelNe : category.label}
        </button>
      ))}
    </div>
  );
};
