import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Source, Transaction, TransactionType } from '../db/types';
import { monthKeyOf } from '../utils/date';

export interface TransactionFilters {
  monthKey?: string;
  type?: TransactionType;
  categoryId?: number;
  source?: Source;
}

export function useTransactions(filters: TransactionFilters = {}): Transaction[] {
  const { monthKey, type, categoryId, source } = filters;

  return useLiveQuery(
    async () => {
      const base = monthKey
        ? await db.transactions.where('monthKey').equals(monthKey).toArray()
        : await db.transactions.toArray();

      const filtered = base.filter((t) => {
        if (type && t.type !== type) return false;
        if (categoryId !== undefined && t.categoryId !== categoryId) return false;
        if (source && t.source !== source) return false;
        return true;
      });

      return filtered.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
    },
    [monthKey, type, categoryId, source],
    []
  );
}

export async function addTransaction(input: Omit<Transaction, 'id' | 'monthKey' | 'createdAt'>) {
  await db.transactions.add({
    ...input,
    monthKey: monthKeyOf(input.date),
    createdAt: Date.now(),
  });
}

export async function updateTransaction(
  id: number,
  input: Omit<Transaction, 'id' | 'monthKey' | 'createdAt'>
) {
  await db.transactions.update(id, {
    ...input,
    monthKey: monthKeyOf(input.date),
  });
}

export async function deleteTransaction(id: number) {
  await db.transactions.delete(id);
}
