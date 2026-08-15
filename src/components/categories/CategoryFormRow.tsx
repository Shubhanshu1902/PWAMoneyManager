import { useState } from 'react';
import type { Category } from '../../db/types';

interface Props {
  category: Category;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export function CategoryFormRow({ category, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);

  function commit() {
    setEditing(false);
    if (name.trim() && name.trim() !== category.name) {
      onRename(name.trim());
    } else {
      setName(category.name);
    }
  }

  return (
    <div className="category-row">
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
      ) : (
        <span className="category-row-name" onClick={() => setEditing(true)}>
          {category.name}
          {category.isDefault && <span className="badge">default</span>}
        </span>
      )}
      <button type="button" className="danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
