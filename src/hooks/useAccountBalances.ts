import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Source } from '../db/types';
import { SOURCES } from '../db/types';

export function useAccountBalances(): Record<Source, number> {
  return useLiveQuery(
    async () => {
      const all = await db.transactions.toArray();
      const balances: Record<Source, number> = Object.fromEntries(
        SOURCES.map((s) => [s, 0])
      ) as Record<Source, number>;

      for (const t of all) {
        if (t.type === 'income') {
          balances[t.source] += t.amount;
        } else if (t.type === 'expense') {
          balances[t.source] -= t.amount;
        } else if (t.type === 'transfer' && t.toSource) {
          balances[t.source] -= t.amount;
          balances[t.toSource] += t.amount;
        }
      }

      return balances;
    },
    [],
    Object.fromEntries(SOURCES.map((s) => [s, 0])) as Record<Source, number>
  );
}
