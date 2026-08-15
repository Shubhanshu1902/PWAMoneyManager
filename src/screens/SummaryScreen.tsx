import { useState } from 'react';
import { AccountBalances } from '../components/summary/AccountBalances';
import { MonthPicker } from '../components/summary/MonthPicker';
import { MonthlySummary } from '../components/summary/MonthlySummary';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { currentMonthKey } from '../utils/date';

export function SummaryScreen() {
  const [monthKey, setMonthKey] = useState(currentMonthKey());
  const categories = useCategories();
  const transactions = useTransactions({ monthKey });

  return (
    <div className="screen">
      <h1>Summary</h1>
      <h2>Balances</h2>
      <AccountBalances />
      <MonthPicker monthKey={monthKey} onChange={setMonthKey} />
      <MonthlySummary transactions={transactions} categories={categories} />
    </div>
  );
}
