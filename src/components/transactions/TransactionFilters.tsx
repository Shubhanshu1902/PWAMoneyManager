import type { Category, Source, TransactionType } from '../../db/types';
import { SOURCES } from '../../db/types';
import type { TransactionFilters as Filters } from '../../hooks/useTransactions';
import { formatMonthKey, shiftMonthKey } from '../../utils/date';

interface Props {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
}

export function TransactionFilters({ filters, categories, onChange }: Props) {
  const monthKey = filters.monthKey!;

  return (
    <div className="filters">
      <div className="month-nav">
        <button type="button" onClick={() => onChange({ ...filters, monthKey: shiftMonthKey(monthKey, -1) })}>
          ‹
        </button>
        <span>{formatMonthKey(monthKey)}</span>
        <button type="button" onClick={() => onChange({ ...filters, monthKey: shiftMonthKey(monthKey, 1) })}>
          ›
        </button>
      </div>

      <div className="filter-row">
        <select
          value={filters.type ?? ''}
          onChange={(e) =>
            onChange({ ...filters, type: (e.target.value || undefined) as TransactionType | undefined })
          }
        >
          <option value="">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>

        <select
          value={filters.categoryId ?? ''}
          onChange={(e) =>
            onChange({ ...filters, categoryId: e.target.value ? Number(e.target.value) : undefined })
          }
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.source ?? ''}
          onChange={(e) => onChange({ ...filters, source: (e.target.value || undefined) as Source | undefined })}
        >
          <option value="">All sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
