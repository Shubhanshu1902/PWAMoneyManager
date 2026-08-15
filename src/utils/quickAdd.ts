import type { Source } from '../db/types';

const KEYWORD_SOURCE: Record<string, Source> = {
  hdfc: 'Salary Account',
  icici: 'Credit Card',
};

export interface QuickAddPayload {
  amount: number;
  source?: Source;
  keyword?: string;
  note?: string;
}

export function parseQuickAdd(search: string): QuickAddPayload | null {
  const params = new URLSearchParams(search);
  const amountRaw = params.get('qaAmount');
  if (!amountRaw) return null;

  const amount = parseFloat(amountRaw);
  if (!amount || amount <= 0) return null;

  const keyword = params.get('qaKeyword')?.toLowerCase() || undefined;
  const source = keyword ? KEYWORD_SOURCE[keyword] : undefined;
  const note = params.get('qaNote') || undefined;

  return { amount, source, keyword, note };
}
