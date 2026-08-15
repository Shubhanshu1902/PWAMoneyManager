import Dexie, { type Table } from 'dexie';
import type { Transaction, Category, RecurringRule } from './types';

export class MoneyManagerDB extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, number>;
  recurringRules!: Table<RecurringRule, number>;

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
  }
}

export const db = new MoneyManagerDB();
