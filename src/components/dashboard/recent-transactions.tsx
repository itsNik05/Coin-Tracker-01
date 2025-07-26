
'use client';
import { useAppState } from "@/app/state-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RecentTransactions() {
  const { transactions, getCategoryByName, deleteTransaction } = useAppState();
  const { toast } = useToast();

  const recentTransactions = transactions.slice(0, 5);

  const handleDelete = (id: string) => {
    try {
      deleteTransaction(id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive",
      });
    }
  };

  if (recentTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground">
        No transactions yet. Add one to get started!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(t.id)}
                  >
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
