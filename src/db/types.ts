export type TransactionType = 'expense' | 'income' | 'transfer';

export type Source = 'Salary Account' | 'Credit Card';
export const SOURCES: Source[] = ['Salary Account', 'Credit Card'];

export type Frequency = 'weekly' | 'monthly';

export interface Category {
  id?: number;
  name: string;
  isDefault: boolean;
}

export interface Transaction {
  id?: number;
  amount: number;
  type: TransactionType;
  date: string; // 'YYYY-MM-DD'
  monthKey: string; // 'YYYY-MM'
  categoryId?: number; // not used when type === 'transfer'
  source: Source; // for transfer, this is the "from" account
  toSource?: Source; // only set when type === 'transfer'
  note?: string;
  createdAt: number;
}

export interface RecurringRule {
  id?: number;
  type: TransactionType;
  amount: number;
  categoryId?: number; // not used when type === 'transfer'
  source: Source; // for transfer, this is the "from" account
  toSource?: Source; // only set when type === 'transfer'
  note?: string;
  frequency: Frequency;
  nextDueDate: string; // 'YYYY-MM-DD' — also implicitly encodes day-of-month/day-of-week
  active: boolean;
}
