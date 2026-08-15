import Dexie, { type Table } from 'dexie';
import type { Transaction, Category, RecurringRule, PendingImport } from './types';

export class MoneyManagerDB extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, number>;
  recurringRules!: Table<RecurringRule, number>;
  pendingImports!: Table<PendingImport, number>;

  constructor() {
    super('MoneyManagerDB');
    this.version(1).stores({
      transactions: '++id, date, monthKey, categoryId, source, type',
      categories: '++id, name',
    });
    // v2: add recurringRules table (auto-generates due transactions on app start)
    // `active` is intentionally not indexed — IndexedDB doesn't support boolean index keys
    this.version(2).stores({
      transactions: '++id, date, monthKey, categoryId, source, type',
      categories: '++id, name',
      recurringRules: '++id, nextDueDate',
    });
    // v3: add pendingImports table (SMS quick-add queue, reviewed/confirmed manually)
    this.version(3).stores({
      transactions: '++id, date, monthKey, categoryId, source, type',
      categories: '++id, name',
      recurringRules: '++id, nextDueDate',
      pendingImports: '++id, capturedAt',
    });
  }
}

export const db = new MoneyManagerDB();
