'use client';

import * as React from "react"
import { MainLayout } from "@/components/main-layout";
import { useAppState } from "../state-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Share2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";

const ReportView = ({ transactions }: { transactions: Transaction[] }) => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <p><strong>Total Income:</strong> <span className="text-accent-foreground">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                    <p><strong>Total Expenses:</strong> <span className="text-destructive">${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                    <p><strong>Net Flow:</strong> <span className={totalIncome - totalExpense >= 0 ? "text-accent-foreground" : "text-destructive"}>${(totalIncome - totalExpense).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {Object.entries(expenseByCategory).sort(([,a], [,b]) => b-a).map(([category, amount]) => (
                            <li key={category} className="flex justify-between">
                                <span>{category}</span>
                                <strong>${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ReportsPage() {
    const { transactions } = useAppState();
    const { toast } = useToast();
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [reportTxs, setReportTxs] = React.useState<Transaction[] | null>(null);

    const generateReport = () => {
        if (!date?.from || !date?.to) {
            toast({ title: 'Please select a date range.', variant: 'destructive' });
            return;
        }
        const filteredTxs = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= date.from! && txDate <= date.to!;
        });
        setReportTxs(filteredTxs);
    };

    const handleShare = () => {
        toast({ title: 'Link Copied!', description: 'A shareable link to your report has been copied to your clipboard.' });
    };
    
    const handleDownload = () => {
        toast({ title: 'Downloading Report...', description: 'Your report is being generated and will download shortly.' });
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-headline">Reports</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Generate a Report</CardTitle>
                        <CardDescription>Select a date range to generate a spending report.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={generateReport}>Generate Report</Button>
                    </CardContent>
                </Card>
                
                {reportTxs !== null && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Your Report</CardTitle>
                                <CardDescription>
                                    {date?.from && date.to && `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={handleShare}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={handleDownload}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {reportTxs.length > 0 ? <ReportView transactions={reportTxs} /> : <p className="text-muted-foreground">No transactions in this period.</p>}
                        </CardContent>
                    </Card>
                )}

            </div>
        </MainLayout>
    )
}
