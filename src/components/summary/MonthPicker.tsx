import { formatMonthKey, shiftMonthKey } from '../../utils/date';

interface Props {
  monthKey: string;
  onChange: (monthKey: string) => void;
}

export function MonthPicker({ monthKey, onChange }: Props) {
  return (
    <div className="month-nav">
      <button type="button" onClick={() => onChange(shiftMonthKey(monthKey, -1))}>
        ‹
      </button>
      <span>{formatMonthKey(monthKey)}</span>
      <button type="button" onClick={() => onChange(shiftMonthKey(monthKey, 1))}>
        ›
      </button>
    </div>
  );
}
