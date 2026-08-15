import { db } from './db';
import type { Transaction } from './types';
import { addDaysISO, addMonthsClampedISO, monthKeyOf, todayISODate } from '../utils/date';

export async function generateDueRecurringTransactions() {
  const today = todayISODate();
  const rules = await db.recurringRules.toArray();

  for (const rule of rules) {
    if (!rule.active) continue;

    let nextDue = rule.nextDueDate;
    const newTransactions: Omit<Transaction, 'id'>[] = [];

    while (nextDue <= today) {
      newTransactions.push({
        amount: rule.amount,
        type: rule.type,
        date: nextDue,
        monthKey: monthKeyOf(nextDue),
        categoryId: rule.categoryId,
        source: rule.source,
        toSource: rule.toSource,
        note: rule.note,
        createdAt: Date.now(),
      });
      nextDue = rule.frequency === 'monthly' ? addMonthsClampedISO(nextDue, 1) : addDaysISO(nextDue, 7);
    }

    if (newTransactions.length > 0) {
      await db.transactions.bulkAdd(newTransactions as Transaction[]);
      await db.recurringRules.update(rule.id!, { nextDueDate: nextDue });
    }
  }
}
