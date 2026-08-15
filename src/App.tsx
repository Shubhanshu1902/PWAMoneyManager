import { useState } from 'react';
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

function App() {
  const [tab, setTab] = useState<TabKey>('add');
  const pendingItems = usePendingImports();

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
