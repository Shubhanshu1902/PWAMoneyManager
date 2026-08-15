import { useState } from 'react';
import type { Category, Source, Transaction, TransactionType } from '../../db/types';
import { SOURCES } from '../../db/types';
import { todayISODate } from '../../utils/date';

export interface TransactionFormValues {
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: number;
  source: Source;
  toSource?: Source;
  note?: string;
}

interface Props {
  categories: Category[];
  initial?: Transaction;
  onSave: (values: TransactionFormValues) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
}

const otherSource = (s: Source) => SOURCES.find((x) => x !== s) ?? SOURCES[0];

export function TransactionForm({ categories, initial, onSave, onCancel, onDelete }: Props) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [date, setDate] = useState(initial?.date ?? todayISODate());
  const [categoryId, setCategoryId] = useState<number | undefined>(initial?.categoryId);
  const [source, setSource] = useState<Source>(initial?.source ?? SOURCES[0]);
  const [toSource, setToSource] = useState<Source>(
    initial?.toSource ?? otherSource(initial?.source ?? SOURCES[0])
  );
  const [note, setNote] = useState(initial?.note ?? '');
  const [savedMessage, setSavedMessage] = useState(false);

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
      amount: parsedAmount,
      type,
      date,
      categoryId: isTransfer ? undefined : categoryId,
      source,
      toSource: isTransfer ? toSource : undefined,
      note: note.trim() || undefined,
    });

    if (!isEdit) {
      setAmount('');
      setNote('');
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 1500);
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="segmented">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : ''}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : ''}
          onClick={() => setType('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={type === 'transfer' ? 'active' : ''}
          onClick={() => setType('transfer')}
        >
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

      <label className="field">
        <span>Date</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
                <button
                  key={s}
                  type="button"
                  className={source === s ? 'active' : ''}
                  onClick={() => handleFromChange(s)}
                >
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
              <button
                key={s}
                type="button"
                className={source === s ? 'active' : ''}
                onClick={() => setSource(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </label>
      )}

      <label className="field">
        <span>Note (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Swiggy order"
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="primary">
          {isEdit ? 'Save changes' : 'Add'}
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

      {savedMessage && <p className="saved-message">Added ✓</p>}
    </form>
  );
}
