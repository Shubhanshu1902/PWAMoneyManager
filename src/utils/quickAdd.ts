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

function extractAmount(raw: string): number | null {
  // Tolerates stray prefixes/currency symbols (e.g. "Rs.161.00") from imprecise
  // Shortcuts regex wiring — pulls out the first proper decimal/integer number.
  const match = raw.match(/\d[\d,]*\.\d{1,2}/) ?? raw.match(/\d[\d,]*/);
  if (!match) return null;
  const amount = parseFloat(match[0].replace(/,/g, ''));
  return amount > 0 ? amount : null;
}

export function hasQuickAddQuery(search: string): boolean {
  return new URLSearchParams(search).has('qaAmount');
}

export function parseQuickAdd(search: string): QuickAddPayload | null {
  const params = new URLSearchParams(search);
  const amountRaw = params.get('qaAmount');
  if (!amountRaw) return null;

  const amount = extractAmount(amountRaw);
  if (!amount) return null;

  const keyword = params.get('qaKeyword')?.toLowerCase() || undefined;
  const source = keyword ? KEYWORD_SOURCE[keyword] : undefined;
  const note = params.get('qaNote') || undefined;

  return { amount, source, keyword, note };
}
