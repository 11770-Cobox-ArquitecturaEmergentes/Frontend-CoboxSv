import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui';
import { formatStatusLabel } from '../utils/formatters';

type DashboardStatusChartProps = {
  title: string;
  data: Record<string, number>;
  emptyMessage: string;
  color?: string;
};

export function DashboardStatusChart({
  title,
  data,
  emptyMessage,
  color = '#0F766E',
}: DashboardStatusChartProps) {
  const chartData = Object.entries(data).map(([status, value]) => ({
    status,
    label: formatStatusLabel(status),
    value,
  }));

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      </div>
      {chartData.length > 0 ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [Number(value).toLocaleString('es-PE'), 'Total']}
                labelFormatter={(_, payload) => formatStatusLabel(String(payload?.[0]?.payload?.status ?? ''))}
              />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}
