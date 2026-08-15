import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { PendingImport } from '../db/types';
import { addTransaction, type TransactionInput } from './useTransactions';

export function usePendingImports(): PendingImport[] {
  return useLiveQuery(
    () => db.pendingImports.orderBy('capturedAt').reverse().toArray(),
    [],
    []
  );
}

export async function addPendingImport(input: Omit<PendingImport, 'id' | 'capturedAt'>) {
  await db.pendingImports.add({ ...input, capturedAt: Date.now() });
}

export async function discardPendingImport(id: number) {
  await db.pendingImports.delete(id);
}

export async function confirmPendingImport(id: number, values: TransactionInput) {
  await addTransaction(values);
  await db.pendingImports.delete(id);
}
