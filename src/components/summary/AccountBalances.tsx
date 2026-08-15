import { SOURCES } from '../../db/types';
import { useAccountBalances } from '../../hooks/useAccountBalances';
import { formatCurrency } from '../../utils/currency';

export function AccountBalances() {
  const balances = useAccountBalances();

  return (
    <div className="stat-tiles">
      {SOURCES.map((source) => (
        <div key={source} className={`stat-tile ${balances[source] >= 0 ? 'income' : 'expense'}`}>
          <span>{source}</span>
          <strong>{formatCurrency(balances[source])}</strong>
        </div>
      ))}
    </div>
  );
}
