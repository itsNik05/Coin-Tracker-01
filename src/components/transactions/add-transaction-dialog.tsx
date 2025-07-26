
'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppState } from '@/app/state-provider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

export default function AddTransactionDialog() {
  const { addTransaction, categories, categorizeTransaction } = useAppState();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = categories.filter(c => c.name !== 'Income');
  const incomeCategory = categories.find(c => c.name === 'Income');

  useEffect(() => {
    if (type === 'income' && incomeCategory) {
      setCategory(incomeCategory.name);
    } else {
      setCategory('');
    }
  }, [type, incomeCategory]);

  const handleSmartCategorize = async () => {
    if (!description) {
      toast({
        title: "Description needed",
        description: "Please enter a transaction description first.",
        variant: "destructive",
      });
      return;
    }
    setIsCategorizing(true);
    try {
      const suggestedCategory = await categorizeTransaction(description);
      if (suggestedCategory) {
        setCategory(suggestedCategory);
        toast({
          title: "Category Suggested!",
          description: `We've set the category to "${suggestedCategory}".`,
        });
      } else {
        toast({
          title: "Suggestion Failed",
          description: "Could not suggest a category. Please select one manually.",
          variant: "destructive",
        });
      }
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all fields.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);
    try {
      await addTransaction({
        description,
        amount: parseFloat(amount),
        type,
        category,
      });
      toast({
        title: "Transaction Added",
        description: `${description} for $${amount} was added.`,
      });
      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('');
      setOpen(false);
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Transaction</DialogTitle>
          <DialogDescription>
            Log your income or expense to keep track of your budget.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select onValueChange={(value) => setType(value as any)} defaultValue={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <div className="col-span-3 flex gap-2">
                <Select onValueChange={setCategory} value={category} disabled={type === 'income'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {type === 'expense' ? (
                      expenseCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)
                    ) : (
                      incomeCategory && <SelectItem value={incomeCategory.name}>{incomeCategory.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {type === 'expense' && (
                  <Button type="button" variant="outline" size="icon" onClick={handleSmartCategorize} disabled={isCategorizing}>
                    {isCategorizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span className="sr-only">Smart Categorize</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
