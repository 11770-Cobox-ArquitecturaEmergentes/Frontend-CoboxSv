import { Select } from '@/components/ui';
import type { Option } from '../constants';

type FilterDropdownProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  className?: string;
};

export function FilterDropdown<T extends string>({
  value,
  onChange,
  options,
  className,
}: FilterDropdownProps<T>) {
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}