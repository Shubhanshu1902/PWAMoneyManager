import { TransactionForm } from '../components/transactions/TransactionForm';
import { useCategories } from '../hooks/useCategories';
import { addTransaction } from '../hooks/useTransactions';

export function AddTransactionScreen() {
  const categories = useCategories();

  return (
    <div className="screen">
      <h1>Add Transaction</h1>
      <TransactionForm categories={categories} onSave={(values) => addTransaction(values)} />
    </div>
  );
}
