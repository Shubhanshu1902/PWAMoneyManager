import { useState } from 'react';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { useCategories } from '../hooks/useCategories';
import { deleteTransaction, updateTransaction, useTransactions } from '../hooks/useTransactions';
import type { TransactionFilters as Filters } from '../hooks/useTransactions';
import type { Transaction } from '../db/types';
import { currentMonthKey } from '../utils/date';

export function HistoryScreen() {
  const [filters, setFilters] = useState<Filters>({ monthKey: currentMonthKey() });
  const [editing, setEditing] = useState<Transaction | null>(null);
  const categories = useCategories();
  const transactions = useTransactions(filters);

  return (
    <div className="screen">
      <h1>History</h1>
      <TransactionFilters filters={filters} categories={categories} onChange={setFilters} />
      <TransactionList transactions={transactions} categories={categories} onSelect={setEditing} />

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Transaction</h2>
            <TransactionForm
              categories={categories}
              initial={editing}
              onSave={async (values) => {
                await updateTransaction(editing.id!, values);
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
              onDelete={async () => {
                if (confirm('Delete this transaction?')) {
                  await deleteTransaction(editing.id!);
                  setEditing(null);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
