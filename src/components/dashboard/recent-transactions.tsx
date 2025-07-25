'use client';
import { useAppState } from "@/app/state-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RecentTransactions() {
  const { transactions, getCategoryByName } = useAppState();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTransactions.map(t => {
          const category = getCategoryByName(t.category);
          const Icon = category?.icon;
          return (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    {t.category}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-accent-foreground' : 'text-destructive'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
