import { useState } from 'react';
import { CategoryManager } from '../components/categories/CategoryManager';
import { ImportTransactions } from '../components/import/ImportTransactions';

export function CategoriesScreen() {
  const [importing, setImporting] = useState(false);

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Categories</h1>
        <button type="button" className="primary small" onClick={() => setImporting(true)}>
          Import
        </button>
      </div>
      <CategoryManager />

      {importing && (
        <div className="modal-overlay" onClick={() => setImporting(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Import Transactions</h2>
            <ImportTransactions onClose={() => setImporting(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
