import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { vehicleHealthData } from '@/data/dashboardData';

export function VehicleHealthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <DashboardCard title="Salud de vehículos">
        <div className="flex flex-col items-center">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                  stroke="none"
                >
                  {vehicleHealthData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex w-full justify-center gap-6">
            {vehicleHealthData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#64748B]">{item.name}</span>
                <span className="font-semibold text-[#0F172A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </motion.div>
  );
}
