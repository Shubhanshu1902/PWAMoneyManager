import { useState } from 'react';
import { GistSyncSettings } from '../components/pending/GistSyncSettings';
import { PendingListItem } from '../components/pending/PendingListItem';
import { TransactionForm } from '../components/transactions/TransactionForm';
import type { PendingImport, Transaction } from '../db/types';
import { SOURCES } from '../db/types';
import { useCategories } from '../hooks/useCategories';
import { confirmPendingImport, discardPendingImport, usePendingImports } from '../hooks/usePendingImports';
import { todayISODate } from '../utils/date';
import { getGistConfig, syncPendingFromGist } from '../utils/gistSync';

function toFormInitial(item: PendingImport): Transaction {
  return {
    type: 'expense',
    amount: item.amount,
    date: todayISODate(),
    categoryId: undefined,
    source: item.source ?? SOURCES[0],
    note: item.note,
    monthKey: '',
    createdAt: 0,
  };
}

export function PendingScreen() {
  const categories = useCategories();
  const items = usePendingImports();
  const [reviewing, setReviewing] = useState<PendingImport | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  async function handleSync() {
    if (!getGistConfig()) {
      setSettingsOpen(true);
      return;
    }
    setSyncing(true);
    setSyncMessage(null);
    const result = await syncPendingFromGist();
    setSyncing(false);
    setSyncMessage(
      result.error ? result.error : result.imported > 0 ? `Synced ${result.imported} new entr${result.imported === 1 ? 'y' : 'ies'}` : 'Nothing new'
    );
    setTimeout(() => setSyncMessage(null), 3000);
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Pending</h1>
        <div className="form-actions">
          <button type="button" className="primary small" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing…' : 'Sync'}
          </button>
          <button type="button" className="primary small" onClick={() => setSettingsOpen(true)}>
            ⚙
          </button>
        </div>
      </div>
      {syncMessage && <p className="saved-message">{syncMessage}</p>}

      {items.length === 0 ? (
        <p className="empty-state">
          Nothing pending. Tap Sync to pull in anything the Shortcuts automation captured, or set up sync
          via the ⚙ button if you haven't yet.
        </p>
      ) : (
        <div className="transaction-list">
          {items.map((item) => (
            <PendingListItem key={item.id} item={item} onClick={() => setReviewing(item)} />
          ))}
        </div>
      )}

      {reviewing && (
        <div className="modal-overlay" onClick={() => setReviewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Review entry</h2>
            <TransactionForm
              categories={categories}
              initial={toFormInitial(reviewing)}
              onSave={async (values) => {
                await confirmPendingImport(reviewing.id!, values);
                setReviewing(null);
              }}
              onCancel={() => setReviewing(null)}
              onDelete={async () => {
                if (confirm('Discard this pending entry?')) {
                  await discardPendingImport(reviewing.id!);
                  setReviewing(null);
                }
              }}
            />
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Gist sync settings</h2>
            <GistSyncSettings onClose={() => setSettingsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
