'use client';
import { useAppState } from "@/app/state-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { Edit, Trash2 } from "lucide-react"; // Import icons

export default function RecentTransactions() {
  const { transactions, getCategoryByName } = useAppState();

  const recentTransactions = transactions.slice(0, 5);

  // Placeholder functions for now
  const handleDelete = (id: string) => {
    console.log("Delete transaction with ID:", id);
    // TODO: Implement actual delete logic
  };

  const handleEdit = (id: string) => {
    console.log("Edit transaction with ID:", id);
    // TODO: Implement actual edit logic
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Actions</TableHead> {/* Add Actions header */}
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
              <TableCell> {/* Add Actions cell */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(t.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
