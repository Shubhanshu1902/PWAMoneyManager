export type TabKey = 'add' | 'history' | 'summary' | 'recurring' | 'categories';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'add', label: 'Add', icon: '+' },
  { key: 'history', label: 'History', icon: '☰' },
  { key: 'summary', label: 'Summary', icon: '◔' },
  { key: 'recurring', label: 'Repeat', icon: '↻' },
  { key: 'categories', label: 'Categories', icon: '☷' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab-bar-btn${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="tab-bar-icon">{tab.icon}</span>
          <span className="tab-bar-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
