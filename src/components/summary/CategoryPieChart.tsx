import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currency';
import { CHART_COLORS, OTHER_COLOR, OTHER_THRESHOLD } from '../../utils/chartColors';

interface Slice {
  name: string;
  value: number;
}

interface ChartSlice extends Slice {
  isOther?: boolean;
}

interface Props {
  data: Slice[];
}

function groupSmallSlices(data: Slice[]): ChartSlice[] {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return data;

  const main = data.filter((d) => d.value / total >= OTHER_THRESHOLD);
  const rest = data.filter((d) => d.value / total < OTHER_THRESHOLD);
  if (rest.length === 0) return main;
  if (rest.length === 1) return [...main, ...rest];

  const otherTotal = rest.reduce((sum, d) => sum + d.value, 0);
  return [...main, { name: `Other (${rest.length})`, value: otherTotal, isOther: true }];
}

function colorFor(slice: ChartSlice, index: number): string {
  return slice.isOther ? OTHER_COLOR : CHART_COLORS[index % CHART_COLORS.length];
}

export function CategoryPieChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="empty-state">No expenses to chart this month.</p>;
  }

  const chartData = groupSmallSlices(data);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={chartData.length > 1 ? 2 : 0}
          isAnimationActive={false}
        >
          {chartData.map((slice, i) => (
            <Cell key={i} fill={colorFor(slice, i)} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
