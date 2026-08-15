import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { RecurringRule } from '../db/types';

export function useRecurringRules(): RecurringRule[] {
  return useLiveQuery(() => db.recurringRules.orderBy('nextDueDate').toArray(), [], []);
}

export async function addRecurringRule(rule: Omit<RecurringRule, 'id'>) {
  await db.recurringRules.add(rule);
}

export async function updateRecurringRule(id: number, rule: Omit<RecurringRule, 'id'>) {
  await db.recurringRules.update(id, rule);
}

export async function deleteRecurringRule(id: number) {
  await db.recurringRules.delete(id);
}
