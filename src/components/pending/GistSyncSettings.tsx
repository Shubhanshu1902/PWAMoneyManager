import { useState } from 'react';
import { clearGistConfig, getGistConfig, saveGistConfig } from '../../utils/gistSync';

interface Props {
  onClose: () => void;
}

export function GistSyncSettings({ onClose }: Props) {
  const existing = getGistConfig();
  const [token, setToken] = useState(existing?.token ?? '');
  const [gistId, setGistId] = useState(existing?.gistId ?? '');

  function handleSave() {
    if (!token.trim() || !gistId.trim()) return;
    saveGistConfig({ token: token.trim(), gistId: gistId.trim() });
    onClose();
  }

  function handleClear() {
    clearGistConfig();
    setToken('');
    setGistId('');
  }

  return (
    <div className="import-panel">
      <p className="import-help">
        Create a GitHub Personal Access Token scoped to <code>gist</code> only (github.com → Settings →
        Developer settings → Tokens → Generate new token → classic → check just the "gist" scope).
        Paste it here and it's stored only on this device (browser local storage) — never sent anywhere
        except GitHub's API, never committed to any repo.
      </p>
      <label className="field">
        <span>GitHub token</span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          autoCapitalize="off"
          autoCorrect="off"
        />
      </label>
      <label className="field">
        <span>Gist ID</span>
        <input
          type="text"
          value={gistId}
          onChange={(e) => setGistId(e.target.value)}
          placeholder="e.g. 52e9cebf778b89f7842ead82eb844ea8"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </label>
      <div className="form-actions">
        <button type="button" className="primary" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {existing && (
          <button type="button" className="danger" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
