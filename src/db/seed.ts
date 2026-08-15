import { db } from './db';

const DEFAULT_CATEGORIES = [
  'Food Order',
  'Groceries',
  'Running Equipment',
  'Clothes',
  'Shoes',
  'Bills',
  'Transport',
  'Entertainment',
  'Salary',
  'Other',
];

export async function seedDefaultCategories() {
  const count = await db.categories.count();
  if (count > 0) return;

  await db.categories.bulkAdd(
    DEFAULT_CATEGORIES.map((name) => ({ name, isDefault: true }))
  );
}
