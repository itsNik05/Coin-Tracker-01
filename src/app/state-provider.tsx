
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { type Transaction, type Budget, type Category } from '@/lib/types';
import { categories as defaultCategories } from '@/lib/data';
import { categorizeTransaction as categorizeTransactionFlow } from '@/ai/flows/categorize-transaction';

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBudget: (budget: Omit<Budget, 'id'>) => void;
  getCategoryByName: (name: string) => Category | undefined;
  categorizeTransaction: (description: string) => Promise<string | null>;
  deleteTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Helper function to get data from sessionStorage
const getFromSession = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue, (key, value) => {
        // Reviver to convert date strings back to Date objects
        if (key === 'date' && typeof value === 'string') {
          return new Date(value);
        }
        return value;
      });
    }
  }
  return defaultValue;
};

// Helper function to set data in sessionStorage
const setInSession = <T,>(key: string, value: T) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => getFromSession('transactions', []));
  const [budgets, setBudgets] = useState<Budget[]>(() => getFromSession('budgets', []));
  const [loading] = useState(false); // No async loading for session storage

  useEffect(() => {
    setInSession('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    setInSession('budgets', budgets);
  }, [budgets]);


  const getCategoryByName = (name: string): Category | undefined => {
    return defaultCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: new Date().toISOString(), // Simple unique ID
      date: new Date(),
    };
    const newTransactions = [newTransaction, ...transactions].sort((a,b) => b.date.getTime() - a.date.getTime());
    setTransactions(newTransactions);
  };
  
  const updateBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => {
        const existing = prev.find(b => b.category === budget.category);
        if (existing) {
            return prev.map(b => b.category === budget.category ? { ...b, amount: budget.amount } : b);
        }
        return [...prev, { ...budget, id: new Date().toISOString() }];
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
    loading,
    addTransaction,
    updateBudget,
    getCategoryByName,
    categorizeTransaction,
    deleteTransaction,
    updateTransaction,
  }), [transactions, budgets, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
