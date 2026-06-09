import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export const StatsCard = ({ icon: Icon, label, value, change = 0 }) => (
  <Card>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-slate-500">{label}</div>
        <div className="mt-2 text-2xl font-extrabold text-slate-950">{value}</div>
      </div>
      {Icon && <Icon className="h-7 w-7 text-brand-500" />}
    </div>
    <div className={`mt-3 flex items-center gap-1 text-xs font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {Math.abs(change)}% vs yesterday
    </div>
  </Card>
);
