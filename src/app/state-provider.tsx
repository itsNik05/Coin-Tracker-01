"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
  deleteTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Helper to get initial state from sessionStorage
const getInitialState = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const item = window.sessionStorage.getItem(key);
    if (item) {
      // Need to parse dates correctly from JSON
      if (key === 'transactions') {
        const parsed = JSON.parse(item);
        return parsed.map((t: any) => ({ ...t, date: new Date(t.date) }));
      }
      return JSON.parse(item);
    }
  } catch (error) {
    console.warn(`Error reading sessionStorage key “${key}”:`, error);
  }
  return fallback;
};


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => getInitialState('transactions', initialTransactions));
  const [budgets, setBudgets] = useState<Budget[]>(() => getInitialState('budgets', initialBudgets));

  // Effect to save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      window.sessionStorage.setItem('transactions', JSON.stringify(transactions));
      window.sessionStorage.setItem('budgets', JSON.stringify(budgets));
    } catch (error) {
      console.warn('Error writing to sessionStorage:', error);
    }
  }, [transactions, budgets]);


  const getCategoryByName = (name: string): Category | undefined => {
    return defaultCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      ...prev,
      { ...transaction, id: `txn-${Date.now()}`, date: new Date() },
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
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
    updateTransaction,
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
