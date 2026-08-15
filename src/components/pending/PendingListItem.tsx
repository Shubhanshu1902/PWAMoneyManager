import type { PendingImport } from '../../db/types';
import { formatCurrency } from '../../utils/currency';

function formatCapturedAt(ts: number) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  item: PendingImport;
  onClick: () => void;
}

export function PendingListItem({ item, onClick }: Props) {
  return (
    <button type="button" className="transaction-item" onClick={onClick}>
      <div className="transaction-item-main">
        <span className="transaction-item-category">
          {item.source ?? 'Unknown account'}
          {!item.source && <span className="badge">needs source</span>}
        </span>
        <span className="transaction-item-meta">{formatCapturedAt(item.capturedAt)}</span>
        {item.note && <span className="transaction-item-note">{item.note}</span>}
      </div>
      <span className="transaction-item-amount expense">{formatCurrency(item.amount)}</span>
    </button>
  );
}
