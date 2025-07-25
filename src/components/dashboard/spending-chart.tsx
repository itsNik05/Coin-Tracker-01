'use client';
import { useAppState } from "@/app/state-provider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function SpendingChart() {
  const { transactions } = useAppState();

  const spendingData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (spendingData.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No spending data available.</div>
  }

  return (
    <ChartContainer config={{}} className="mx-auto aspect-square h-[300px]">
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent 
            hideLabel 
            formatter={(value, name) => [`$${(value as number).toFixed(2)}`, name]} 
          />}
        />
        <Pie
          data={spendingData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          paddingAngle={2}
        >
          {spendingData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
