import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { fleetPerformanceData, CHART_COLORS } from '@/data/dashboardData';

export function FleetPerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <DashboardCard title="Rendimiento de flota">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fleetPerformanceData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="fleetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.gradientFrom} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS.gradientTo} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <YAxis
                domain={[70, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 13,
                }}
                formatter={(value) => [`${value}%`, 'Rendimiento']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={CHART_COLORS.green}
                strokeWidth={3}
                fill="url(#fleetGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </motion.div>
  );
}
