import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

export const SalesChart = ({ data }) => (
  <Card className="h-80">
    <h2 className="mb-4 text-lg font-bold text-slate-950">7-day revenue</h2>
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);
