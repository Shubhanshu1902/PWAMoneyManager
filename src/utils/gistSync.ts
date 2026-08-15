import { addPendingImport } from '../hooks/usePendingImports';
import { sourceForKeyword } from './quickAdd';

const CONFIG_KEY = 'moneyManager.gistSync';

export interface GistSyncConfig {
  token: string;
  gistId: string;
}

export function getGistConfig(): GistSyncConfig | null {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGistConfig(config: GistSyncConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearGistConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

interface GistEntry {
  amount: number;
  keyword?: string;
  note?: string;
}

export interface SyncResult {
  imported: number;
  error?: string;
}

export async function syncPendingFromGist(): Promise<SyncResult> {
  const config = getGistConfig();
  if (!config) return { imported: 0 };

  const headers = {
    Authorization: `token ${config.token}`,
    Accept: 'application/vnd.github+json',
  };

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/gists/${config.gistId}`, { headers });
  } catch {
    return { imported: 0, error: 'Network error reaching GitHub' };
  }

  if (!res.ok) {
    return { imported: 0, error: `GitHub returned ${res.status} — check your token/gist ID` };
  }

  const data = await res.json();
  const files: Record<string, { content: string }> = data.files ?? {};
  const entryNames = Object.keys(files).filter(
    (name) => name.startsWith('entry-') && name.endsWith('.json')
  );
  if (entryNames.length === 0) return { imported: 0 };

  let imported = 0;
  for (const name of entryNames) {
    try {
      const entry: GistEntry = JSON.parse(files[name].content);
      if (!entry.amount || entry.amount <= 0) continue;
      await addPendingImport({
        amount: entry.amount,
        source: sourceForKeyword(entry.keyword),
        keyword: entry.keyword,
        note: entry.note,
      });
      imported++;
    } catch {
      // malformed entry — still gets deleted below so it doesn't jam the queue
    }
  }

  // Best-effort cleanup. If this fails (offline mid-sync, etc.) the same
  // entries get re-imported next sync — an occasional harmless duplicate
  // beats losing entries, and duplicates are easy to spot/discard in review.
  try {
    await fetch(`https://api.github.com/gists/${config.gistId}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: Object.fromEntries(entryNames.map((name) => [name, null])),
      }),
    });
  } catch {
    // ignored — see comment above
  }

  return { imported };
}
