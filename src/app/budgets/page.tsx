
'use client';
import { MainLayout } from "@/components/main-layout";
import { useAppState } from "../state-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const EditBudgetDialog = ({ category, currentAmount }: { category: string, currentAmount: number }) => {
    const { updateBudget } = useAppState();
    const [amount, setAmount] = useState(currentAmount);
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        updateBudget({ category, amount });
        toast({ title: 'Budget Updated', description: `Budget for ${category} set to $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.` });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Budget for {category}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="amount">Budget Amount</Label>
                    <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const NewBudgetDialog = () => {
    const { budgets, categories, updateBudget } = useAppState();
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const availableCategories = categories.filter(c => c.name !== 'Income' && !budgets.find(b => b.category === c.name));

    const handleSubmit = () => {
        if (!category || amount <= 0) {
            toast({ title: 'Invalid Input', description: 'Please select a category and enter a valid amount.', variant: 'destructive' });
            return;
        }
        updateBudget({ category, amount });
        toast({ title: 'Budget Created', description: `Budget for ${category} set to $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.` });
        setCategory('');
        setAmount(0);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Set New Budget</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set a New Budget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="amount">Budget Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Create Budget</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function BudgetsPage() {
    const { transactions, budgets, categories } = useAppState();

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-headline">Budgets</h1>
                    <NewBudgetDialog />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {budgets.map(budget => {
                        const spent = expensesByCategory[budget.category] || 0;
                        const progress = (spent / budget.amount) * 100;
                        const remaining = budget.amount - spent;
                        const categoryInfo = categories.find(c => c.name === budget.category);
                        const Icon = categoryInfo?.icon;

                        return (
                            <Card key={budget.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                                                {budget.category}
                                            </CardTitle>
                                            <CardDescription>${budget.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Budget</CardDescription>
                                        </div>
                                        <EditBudgetDialog category={budget.category} currentAmount={budget.amount} />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Progress value={progress} />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Spent: ${spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        <span className={remaining < 0 ? 'text-destructive font-semibold' : ''}>
                                            {remaining >= 0 ? `Remaining: $${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Overspent: $${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
                {budgets.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't set any budgets yet.</p>
                        <p className="text-muted-foreground">Click "Set New Budget" to get started.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
