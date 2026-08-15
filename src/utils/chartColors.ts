export const CHART_COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4',
  '#a855f7', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
];

export const OTHER_COLOR = '#8b8b96';
export const OTHER_THRESHOLD = 0.04;

interface Slice {
  name: string;
  value: number;
}

export function buildCategoryColorMap(data: Slice[]): Map<string, string> {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const map = new Map<string, string>();
  let colorIndex = 0;
  for (const d of data) {
    if (total > 0 && d.value / total < OTHER_THRESHOLD) {
      map.set(d.name, OTHER_COLOR);
    } else {
      map.set(d.name, CHART_COLORS[colorIndex % CHART_COLORS.length]);
      colorIndex++;
    }
  }
  return map;
}
