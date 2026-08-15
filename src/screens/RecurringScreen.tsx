import { useState } from 'react';
import { RecurringForm } from '../components/recurring/RecurringForm';
import { RecurringListItem } from '../components/recurring/RecurringListItem';
import { useCategories } from '../hooks/useCategories';
import { addRecurringRule, deleteRecurringRule, updateRecurringRule, useRecurringRules } from '../hooks/useRecurring';
import type { RecurringRule } from '../db/types';

export function RecurringScreen() {
  const categories = useCategories();
  const rules = useRecurringRules();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<RecurringRule | null>(null);

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Recurring</h1>
        <button type="button" className="primary small" onClick={() => setAdding(true)}>
          + New
        </button>
      </div>

      {rules.length === 0 ? (
        <p className="empty-state">
          No recurring payments yet. Add one for things like rent, subscriptions, or a monthly credit
          card bill transfer.
        </p>
      ) : (
        <div className="transaction-list">
          {rules.map((r) => (
            <RecurringListItem
              key={r.id}
              rule={r}
              category={r.categoryId ? categoryById.get(r.categoryId) : undefined}
              onClick={() => setEditing(r)}
            />
          ))}
        </div>
      )}

      {(adding || editing) && (
        <div className="modal-overlay" onClick={() => (adding ? setAdding(false) : setEditing(null))}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Recurring Payment' : 'New Recurring Payment'}</h2>
            <RecurringForm
              categories={categories}
              initial={editing ?? undefined}
              onSave={async (values) => {
                if (editing) {
                  await updateRecurringRule(editing.id!, values);
                  setEditing(null);
                } else {
                  await addRecurringRule(values);
                  setAdding(false);
                }
              }}
              onCancel={() => (adding ? setAdding(false) : setEditing(null))}
              onDelete={
                editing
                  ? async () => {
                      if (confirm('Delete this recurring payment?')) {
                        await deleteRecurringRule(editing.id!);
                        setEditing(null);
                      }
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
