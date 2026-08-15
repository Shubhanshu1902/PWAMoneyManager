import type { Category, Transaction } from '../../db/types';
import { SOURCES } from '../../db/types';
import { formatCurrency } from '../../utils/currency';
import { buildCategoryColorMap } from '../../utils/chartColors';
import { CategoryPieChart } from './CategoryPieChart';

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export function MonthlySummary({ transactions, categories }: Props) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const totalIncome = sumBy(transactions, 'income');
  const totalExpense = sumBy(transactions, 'expense');
  const net = totalIncome - totalExpense;

  const expenseByCategory = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const name = t.categoryId ? categoryById.get(t.categoryId)?.name ?? 'Uncategorized' : 'Uncategorized';
    expenseByCategory.set(name, (expenseByCategory.get(name) ?? 0) + t.amount);
  }
  const categoryRows = [...expenseByCategory.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const categoryColors = buildCategoryColorMap(categoryRows);
  const categoryTotal = categoryRows.reduce((sum, r) => sum + r.value, 0);

  const bySource = SOURCES.map((source) => ({
    source,
    expense: sumBy(transactions.filter((t) => t.source === source), 'expense'),
    income: sumBy(transactions.filter((t) => t.source === source), 'income'),
  }));

  const transferByRoute = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== 'transfer') continue;
    const route = `${t.source} → ${t.toSource}`;
    transferByRoute.set(route, (transferByRoute.get(route) ?? 0) + t.amount);
  }
  const transferRows = [...transferByRoute.entries()].map(([route, value]) => ({ route, value }));

  return (
    <div className="summary">
      <div className="stat-tiles">
        <div className="stat-tile income">
          <span>Income</span>
          <strong>{formatCurrency(totalIncome)}</strong>
        </div>
        <div className="stat-tile expense">
          <span>Expense</span>
          <strong>{formatCurrency(totalExpense)}</strong>
        </div>
        <div className={`stat-tile ${net >= 0 ? 'income' : 'expense'}`}>
          <span>Net</span>
          <strong>{formatCurrency(net)}</strong>
        </div>
      </div>

      <h2>Expense by category</h2>
      <CategoryPieChart data={categoryRows} />
      {categoryRows.length > 0 && (
        <table className="breakdown-table">
          <tbody>
            {categoryRows.map((row) => (
              <tr key={row.name}>
                <td>
                  <span
                    className="category-dot"
                    style={{ backgroundColor: categoryColors.get(row.name) }}
                  />
                  {row.name}
                </td>
                <td>{formatCurrency(row.value)}</td>
                <td className="breakdown-table-pct">
                  {categoryTotal > 0 ? `${Math.round((row.value / categoryTotal) * 100)}%` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>By source</h2>
      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Expense</th>
            <th>Income</th>
          </tr>
        </thead>
        <tbody>
          {bySource.map((row) => (
            <tr key={row.source}>
              <td>{row.source}</td>
              <td>{formatCurrency(row.expense)}</td>
              <td>{formatCurrency(row.income)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {transferRows.length > 0 && (
        <>
          <h2>Transfers</h2>
          <table className="breakdown-table">
            <tbody>
              {transferRows.map((row) => (
                <tr key={row.route}>
                  <td>{row.route}</td>
                  <td>{formatCurrency(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function sumBy(transactions: Transaction[], type: Transaction['type']) {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}
