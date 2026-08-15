import { db } from '../db/db';
import type { Transaction } from '../db/types';
import type { ParsedImportRow } from '../utils/importCsv';
import { monthKeyOf } from '../utils/date';

export async function importTransactions(rows: ParsedImportRow[]): Promise<number> {
  const existingCategories = await db.categories.toArray();
  const categoryIdByName = new Map(existingCategories.map((c) => [c.name.toLowerCase(), c.id!]));

  const namesNeeded = new Set(
    rows.map((r) => r.categoryName).filter((n): n is string => Boolean(n))
  );
  for (const name of namesNeeded) {
    if (!categoryIdByName.has(name.toLowerCase())) {
      const id = await db.categories.add({ name, isDefault: false });
      categoryIdByName.set(name.toLowerCase(), id);
    }
  }

  const transactions: Omit<Transaction, 'id'>[] = rows.map((r) => ({
    amount: r.amount,
    type: r.type,
    date: r.date,
    monthKey: monthKeyOf(r.date),
    categoryId: r.categoryName ? categoryIdByName.get(r.categoryName.toLowerCase()) : undefined,
    source: r.source,
    toSource: r.toSource,
    note: r.note,
    createdAt: Date.now(),
  }));

  await db.transactions.bulkAdd(transactions as Transaction[]);
  return transactions.length;
}
