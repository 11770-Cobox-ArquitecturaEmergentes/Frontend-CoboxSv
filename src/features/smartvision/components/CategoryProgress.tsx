import { motion } from 'framer-motion';
import { cn } from '@/utils';
import type { Category } from '../types';

const barColors: Record<string, string> = {
  red: 'bg-[#EF4444]',
  orange: 'bg-[#F59E0B]',
  yellow: 'bg-[#EAB308]',
};

const iconBgColors: Record<string, string> = {
  red: 'bg-red-50 text-[#EF4444]',
  orange: 'bg-amber-50 text-[#F59E0B]',
  yellow: 'bg-yellow-50 text-[#EAB308]',
};

type CategoryProgressProps = {
  categories: Category[];
};

export function CategoryProgress({ categories }: CategoryProgressProps) {
  const maxCount = Math.max(...categories.map((c) => c.count));

  return (
    <div className="space-y-4">
      {categories.map((category, index) => {
        const IconComponent = category.icon;
        const percentage = maxCount > 0 ? (category.count / maxCount) * 100 : 0;

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md',
                    iconBgColors[category.color],
                  )}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-[#111827]">{category.name}</span>
              </div>
              <span className="text-sm font-semibold text-[#111827]">{category.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
                className={cn('h-full rounded-full', barColors[category.color])}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
