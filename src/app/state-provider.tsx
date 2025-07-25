"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { type Transaction, type Budget, type Category } from '@/lib/types';
import { initialTransactions, initialBudgets, categories as defaultCategories } from '@/lib/data';
import { categorizeTransaction as categorizeTransactionFlow } from '@/ai/flows/categorize-transaction';

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBudget: (budget: Budget) => void;
  getCategoryByName: (name: string) => Category | undefined;
  categorizeTransaction: (description: string) => Promise<string | null>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  const getCategoryByName = (name: string): Category | undefined => {
    return defaultCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      ...prev,
      { ...transaction, id: `txn-${Date.now()}`, date: new Date() },
    ].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };
  
  const updateBudget = (budget: Budget) => {
    setBudgets(prev => {
        const existing = prev.find(b => b.category === budget.category);
        if (existing) {
            return prev.map(b => b.category === budget.category ? { ...b, amount: budget.amount } : b);
        }
        return [...prev, { ...budget, id: `bud-${Date.now()}` }];
    });
  };

  const categorizeTransaction = async (description: string) => {
    try {
      const result = await categorizeTransactionFlow({ transactionDescription: description });
      const categoryName = result.category;

      const existingCategory = defaultCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
      
      return existingCategory ? existingCategory.name : 'Other';
    } catch (error) {
      console.error("AI categorization failed:", error);
      return null;
    }
  };

  const value = useMemo(() => ({
    transactions,
    budgets,
    categories: defaultCategories,
    addTransaction,
    updateBudget,
    getCategoryByName,
    categorizeTransaction,
  }), [transactions, budgets]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
