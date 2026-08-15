import { addPendingImport } from '../hooks/usePendingImports';
import type { Source } from '../db/types';
import { hasQuickAddQuery, parseQuickAdd } from '../utils/quickAdd';

export type QuickAddCaptureResult =
  | { status: 'none' }
  | { status: 'error' }
  | { status: 'success'; amount: number; source?: Source; note?: string };

export async function captureQuickAddFromUrl(): Promise<QuickAddCaptureResult> {
  const search = window.location.search;
  if (!hasQuickAddQuery(search)) return { status: 'none' };

  const payload = parseQuickAdd(search);

  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());

  if (!payload) return { status: 'error' };

  await addPendingImport({
    amount: payload.amount,
    source: payload.source,
    keyword: payload.keyword,
    note: payload.note,
  });

  return { status: 'success', amount: payload.amount, source: payload.source, note: payload.note };
}
