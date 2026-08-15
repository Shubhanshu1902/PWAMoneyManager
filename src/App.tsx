import { useEffect, useState } from 'react';
import './App.css';
import { TabBar } from './components/layout/TabBar';
import type { TabKey } from './components/layout/TabBar';
import { AddTransactionScreen } from './screens/AddTransactionScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { RecurringScreen } from './screens/RecurringScreen';
import { PendingScreen } from './screens/PendingScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { usePendingImports } from './hooks/usePendingImports';
import { captureQuickAddFromUrl, type QuickAddCaptureResult } from './db/quickAddCapture';
import { formatCurrency } from './utils/currency';

function App() {
  const [tab, setTab] = useState<TabKey>('add');
  const pendingItems = usePendingImports();
  const [capture, setCapture] = useState<QuickAddCaptureResult>({ status: 'none' });

  useEffect(() => {
    captureQuickAddFromUrl().then(setCapture);
  }, []);

  if (capture.status === 'success' || capture.status === 'error') {
    return (
      <div className="app">
        <div className="quickadd-banner">
          {capture.status === 'success' ? (
            <>
              <span className="quickadd-banner-icon">✓</span>
              <h1>Added to Pending</h1>
              <p>
                {formatCurrency(capture.amount)}
                {capture.source ? ` · ${capture.source}` : ' · unknown account'}
              </p>
              {capture.note && <p className="quickadd-banner-note">{capture.note}</p>}
            </>
          ) : (
            <>
              <span className="quickadd-banner-icon error">⚠</span>
              <h1>Couldn't read this link</h1>
              <p>The amount was missing or unparseable. Check the Shortcut's amount capture.</p>
            </>
          )}
          <button type="button" className="primary" onClick={() => setCapture({ status: 'none' })}>
            Continue to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app-content">
        {tab === 'add' && <AddTransactionScreen />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'summary' && <SummaryScreen />}
        {tab === 'recurring' && <RecurringScreen />}
        {tab === 'pending' && <PendingScreen />}
        {tab === 'categories' && <CategoriesScreen />}
      </main>
      <TabBar active={tab} onChange={setTab} pendingCount={pendingItems.length} />
    </div>
  );
}

export default App;
