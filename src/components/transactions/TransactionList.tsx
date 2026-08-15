import type { Category, Transaction } from '../../db/types';
import { TransactionListItem } from './TransactionListItem';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onSelect: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, categories, onSelect }: Props) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  if (transactions.length === 0) {
    return <p className="empty-state">No transactions yet.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <TransactionListItem
          key={t.id}
          transaction={t}
          category={t.categoryId ? categoryById.get(t.categoryId) : undefined}
          onClick={() => onSelect(t)}
        />
      ))}
    </div>
  );
}
