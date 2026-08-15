import { useState } from 'react';
import { parseImportCsv, type ImportParseResult } from '../../utils/importCsv';
import { importTransactions } from '../../hooks/useImport';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface Props {
  onClose: () => void;
}

export function ImportTransactions({ onClose }: Props) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ImportParseResult | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);

  function handlePreview() {
    setResult(parseImportCsv(text));
    setImportedCount(null);
  }

  async function handleImport() {
    if (!result || result.rows.length === 0) return;
    setImporting(true);
    const count = await importTransactions(result.rows);
    setImporting(false);
    setImportedCount(count);
  }

  if (importedCount !== null) {
    return (
      <div className="import-panel">
        <p className="saved-message">Imported {importedCount} transaction(s) ✓</p>
        <div className="form-actions">
          <button type="button" className="primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="import-panel">
      <p className="import-help">
        Paste CSV with header <code>date,type,amount,category,source,toSource,note</code>. Dates must
        be <code>YYYY-MM-DD</code>, type is expense/income/transfer, source/toSource must match your
        account names exactly.
      </p>
      <textarea
        className="import-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="date,type,amount,category,source,toSource,note&#10;2026-08-01,expense,500,Groceries,Credit Card,,"
        rows={8}
      />

      {!result && (
        <div className="form-actions">
          <button type="button" className="primary" onClick={handlePreview} disabled={!text.trim()}>
            Preview
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      )}

      {result && (
        <div className="import-preview">
          <p>
            {result.rows.length} valid row(s){result.errors.length > 0 && `, ${result.errors.length} error(s)`}
          </p>

          {result.errors.length > 0 && (
            <ul className="import-errors">
              {result.errors.slice(0, 10).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
              {result.errors.length > 10 && <li>...and {result.errors.length - 10} more</li>}
            </ul>
          )}

          {result.rows.length > 0 && (
            <div className="import-sample">
              {result.rows.slice(0, 5).map((r) => (
                <div key={r.line} className="import-sample-row">
                  {formatDate(r.date)} · {r.type} · {formatCurrency(r.amount)} ·{' '}
                  {r.type === 'transfer' ? `${r.source} → ${r.toSource}` : r.categoryName ?? 'Uncategorized'}
                </div>
              ))}
              {result.rows.length > 5 && <div className="import-sample-row">...and {result.rows.length - 5} more</div>}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="primary"
              onClick={handleImport}
              disabled={result.rows.length === 0 || importing}
            >
              {importing ? 'Importing…' : `Import ${result.rows.length} transaction(s)`}
            </button>
            <button type="button" onClick={() => setResult(null)}>
              Back
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
