import { addPendingImport } from '../hooks/usePendingImports';
import { parseQuickAdd } from '../utils/quickAdd';

export async function captureQuickAddFromUrl() {
  const payload = parseQuickAdd(window.location.search);
  if (!payload) return;

  await addPendingImport({
    amount: payload.amount,
    source: payload.source,
    keyword: payload.keyword,
    note: payload.note,
  });

  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
}
