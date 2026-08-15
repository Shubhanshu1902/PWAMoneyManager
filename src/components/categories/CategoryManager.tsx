import { useState } from 'react';
import { addCategory, deleteCategory, renameCategory, useCategories } from '../../hooks/useCategories';
import { CategoryFormRow } from './CategoryFormRow';

export function CategoryManager() {
  const categories = useCategories();
  const [newName, setNewName] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await addCategory(newName);
    setNewName('');
  }

  async function handleDelete(id: number) {
    const result = await deleteCategory(id);
    if (!result.ok) {
      alert(`Can't delete — ${result.inUseCount} transaction(s) use this category.`);
    }
  }

  return (
    <div className="category-manager">
      <form className="category-add-form" onSubmit={handleAdd}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit" className="primary">
          Add
        </button>
      </form>

      <div className="category-list">
        {categories.map((c) => (
          <CategoryFormRow
            key={c.id}
            category={c}
            onRename={(name) => renameCategory(c.id!, name)}
            onDelete={() => handleDelete(c.id!)}
          />
        ))}
      </div>
    </div>
  );
}
