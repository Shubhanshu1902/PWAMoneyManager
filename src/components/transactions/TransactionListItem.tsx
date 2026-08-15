import type { Category, Transaction } from '../../db/types';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface Props {
  transaction: Transaction;
  category?: Category;
  onClick: () => void;
}

export function TransactionListItem({ transaction, category, onClick }: Props) {
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  return (
    <button type="button" className="transaction-item" onClick={onClick}>
      <div className="transaction-item-main">
        <span className="transaction-item-category">
          {isTransfer ? `${transaction.source} → ${transaction.toSource}` : category?.name ?? 'Uncategorized'}
        </span>
        <span className="transaction-item-meta">
          {formatDate(transaction.date)}
          {!isTransfer && ` · ${transaction.source}`}
        </span>
        {transaction.note && <span className="transaction-item-note">{transaction.note}</span>}
      </div>
      <span
        className={`transaction-item-amount ${isTransfer ? 'transfer' : isExpense ? 'expense' : 'income'}`}
      >
        {isTransfer ? '' : isExpense ? '-' : '+'}
        {formatCurrency(transaction.amount)}
      </span>
    </button>
  );
}
