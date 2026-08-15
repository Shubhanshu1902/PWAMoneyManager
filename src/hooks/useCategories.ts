import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Category } from '../db/types';

export function useCategories(): Category[] {
  return useLiveQuery(() => db.categories.orderBy('name').toArray(), [], []);
}

export async function addCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  await db.categories.add({ name: trimmed, isDefault: false });
}

export async function renameCategory(id: number, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  await db.categories.update(id, { name: trimmed });
}

export async function deleteCategory(id: number): Promise<{ ok: boolean; inUseCount?: number }> {
  const inUseCount = await db.transactions.where('categoryId').equals(id).count();
  if (inUseCount > 0) {
    return { ok: false, inUseCount };
  }
  await db.categories.delete(id);
  return { ok: true };
}
