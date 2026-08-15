import type { Category, RecurringRule } from '../../db/types';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface Props {
  rule: RecurringRule;
  category?: Category;
  onClick: () => void;
}

export function RecurringListItem({ rule, category, onClick }: Props) {
  const isTransfer = rule.type === 'transfer';
  const isExpense = rule.type === 'expense';

  const label = isTransfer
    ? `${rule.source} → ${rule.toSource}`
    : category?.name ?? 'Uncategorized';

  return (
    <button type="button" className={`transaction-item${rule.active ? '' : ' paused'}`} onClick={onClick}>
      <div className="transaction-item-main">
        <span className="transaction-item-category">{label}</span>
        <span className="transaction-item-meta">
          {rule.frequency === 'monthly' ? 'Monthly' : 'Weekly'} · next {formatDate(rule.nextDueDate)}
          {!rule.active && ' · Paused'}
        </span>
        {rule.note && <span className="transaction-item-note">{rule.note}</span>}
      </div>
      <span className={`transaction-item-amount ${isTransfer ? 'transfer' : isExpense ? 'expense' : 'income'}`}>
        {isTransfer ? '' : isExpense ? '-' : '+'}
        {formatCurrency(rule.amount)}
      </span>
    </button>
  );
}
