import { useState } from 'react';
import type { Category, Frequency, RecurringRule, Source, TransactionType } from '../../db/types';
import { SOURCES } from '../../db/types';
import { todayISODate } from '../../utils/date';

export type RecurringFormValues = Omit<RecurringRule, 'id'>;

interface Props {
  categories: Category[];
  initial?: RecurringRule;
  onSave: (values: RecurringFormValues) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
}

const otherSource = (s: Source) => SOURCES.find((x) => x !== s) ?? SOURCES[0];

export function RecurringForm({ categories, initial, onSave, onCancel, onDelete }: Props) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [nextDueDate, setNextDueDate] = useState(initial?.nextDueDate ?? todayISODate());
  const [categoryId, setCategoryId] = useState<number | undefined>(initial?.categoryId);
  const [source, setSource] = useState<Source>(initial?.source ?? SOURCES[0]);
  const [toSource, setToSource] = useState<Source>(
    initial?.toSource ?? otherSource(initial?.source ?? SOURCES[0])
  );
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency ?? 'monthly');
  const [note, setNote] = useState(initial?.note ?? '');
  const [active, setActive] = useState(initial?.active ?? true);

  const isEdit = Boolean(initial);
  const isTransfer = type === 'transfer';

  function handleFromChange(s: Source) {
    setSource(s);
    if (s === toSource) setToSource(otherSource(s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    await onSave({
      type,
      amount: parsedAmount,
      categoryId: isTransfer ? undefined : categoryId,
      source,
      toSource: isTransfer ? toSource : undefined,
      note: note.trim() || undefined,
      frequency,
      nextDueDate,
      active,
    });
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="segmented">
        <button type="button" className={type === 'expense' ? 'active expense' : ''} onClick={() => setType('expense')}>
          Expense
        </button>
        <button type="button" className={type === 'income' ? 'active income' : ''} onClick={() => setType('income')}>
          Income
        </button>
        <button type="button" className={type === 'transfer' ? 'active' : ''} onClick={() => setType('transfer')}>
          Transfer
        </button>
      </div>

      <label className="field">
        <span>Amount (₹)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </label>

      {!isTransfer && (
        <label className="field">
          <span>Category</span>
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {isTransfer ? (
        <>
          <label className="field">
            <span>From</span>
            <div className="segmented">
              {SOURCES.map((s) => (
                <button key={s} type="button" className={source === s ? 'active' : ''} onClick={() => handleFromChange(s)}>
                  {s}
                </button>
              ))}
            </div>
          </label>
          <label className="field">
            <span>To</span>
            <div className="segmented">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={s === source}
                  className={toSource === s ? 'active' : ''}
                  onClick={() => setToSource(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
        </>
      ) : (
        <label className="field">
          <span>Source</span>
          <div className="segmented">
            {SOURCES.map((s) => (
              <button key={s} type="button" className={source === s ? 'active' : ''} onClick={() => setSource(s)}>
                {s}
              </button>
            ))}
          </div>
        </label>
      )}

      <label className="field">
        <span>Repeats</span>
        <div className="segmented">
          <button type="button" className={frequency === 'weekly' ? 'active' : ''} onClick={() => setFrequency('weekly')}>
            Weekly
          </button>
          <button type="button" className={frequency === 'monthly' ? 'active' : ''} onClick={() => setFrequency('monthly')}>
            Monthly
          </button>
        </div>
      </label>

      <label className="field">
        <span>Next due date</span>
        <input type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} required />
      </label>

      <label className="field">
        <span>Note (optional)</span>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Rent" />
      </label>

      {isEdit && (
        <label className="field field-inline">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <span>Active (unchecked = paused, won't auto-add)</span>
        </label>
      )}

      <div className="form-actions">
        <button type="submit" className="primary">
          {isEdit ? 'Save changes' : 'Add recurring'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        {onDelete && (
          <button type="button" className="danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
