import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { routeEfficiencyData, CHART_COLORS } from '@/data/dashboardData';

export function RouteEfficiencyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <DashboardCard title="Eficiencia de rutas">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={routeEfficiencyData}
              layout="vertical"
              margin={{ top: 4, right: 32, left: -8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="route"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#0F172A', fontWeight: 500 }}
                width={56}
              />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 13,
                }}
                formatter={(value) => [`${value}%`, 'Eficiencia']}
              />
              <Bar
                dataKey="efficiency"
                radius={[0, 6, 6, 0]}
                animationDuration={800}
                label={{
                  position: 'right',
                  formatter: (v) => `${v}%`,
                  fontSize: 12,
                  fill: '#64748B',
                  fontWeight: 600,
                }}
              >
                {routeEfficiencyData.map((entry) => (
                  <Cell
                    key={entry.route}
                    fill={entry.efficiency >= 90 ? CHART_COLORS.green : entry.efficiency >= 80 ? '#F59E0B' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </motion.div>
  );
}
