import { useState } from 'react';
import { PendingListItem } from '../components/pending/PendingListItem';
import { TransactionForm } from '../components/transactions/TransactionForm';
import type { PendingImport, Transaction } from '../db/types';
import { SOURCES } from '../db/types';
import { useCategories } from '../hooks/useCategories';
import { confirmPendingImport, discardPendingImport, usePendingImports } from '../hooks/usePendingImports';
import { todayISODate } from '../utils/date';

function toFormInitial(item: PendingImport): Transaction {
  return {
    type: 'expense',
    amount: item.amount,
    date: todayISODate(),
    categoryId: undefined,
    source: item.source ?? SOURCES[0],
    note: item.note,
    monthKey: '',
    createdAt: 0,
  };
}

export function PendingScreen() {
  const categories = useCategories();
  const items = usePendingImports();
  const [reviewing, setReviewing] = useState<PendingImport | null>(null);

  return (
    <div className="screen">
      <h1>Pending</h1>

      {items.length === 0 ? (
        <p className="empty-state">
          Nothing pending. Quick-added SMS entries (via the Shortcuts automation) will show up here for
          review.
        </p>
      ) : (
        <div className="transaction-list">
          {items.map((item) => (
            <PendingListItem key={item.id} item={item} onClick={() => setReviewing(item)} />
          ))}
        </div>
      )}

      {reviewing && (
        <div className="modal-overlay" onClick={() => setReviewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Review entry</h2>
            <TransactionForm
              categories={categories}
              initial={toFormInitial(reviewing)}
              onSave={async (values) => {
                await confirmPendingImport(reviewing.id!, values);
                setReviewing(null);
              }}
              onCancel={() => setReviewing(null)}
              onDelete={async () => {
                if (confirm('Discard this pending entry?')) {
                  await discardPendingImport(reviewing.id!);
                  setReviewing(null);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
