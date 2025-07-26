
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { type Transaction, type Budget, type Category } from '@/lib/types';
import { categories as defaultCategories } from '@/lib/data';
import { categorizeTransaction as categorizeTransactionFlow } from '@/ai/flows/categorize-transaction';

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (budget: Omit<Budget, 'id'>) => void;
  getCategoryByName: (name: string) => Category | undefined;
  categorizeTransaction: (description: string) => Promise<string | null>;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const storedTransactions = sessionStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)})));
    }
    const storedBudgets = sessionStorage.getItem('budgets');
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    sessionStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const getCategoryByName = (name: string): Category | undefined => {
    return defaultCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random()}`,
      date: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const updateBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === budget.category);
      if (existing) {
        return prev.map(b => b.category === budget.category ? { ...b, amount: budget.amount } : b);
      }
      return [...prev, { ...budget, id: `budget-${Date.now()}` }];
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

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };


  const value = useMemo(() => ({
    transactions,
    budgets,
    categories: defaultCategories,
    addTransaction,
    updateBudget,
    getCategoryByName,
    categorizeTransaction,
    deleteTransaction,
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
