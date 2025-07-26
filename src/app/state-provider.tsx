
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { type Transaction, type Budget, type Category } from '@/lib/types';
import { categories as defaultCategories } from '@/lib/data';
import { categorizeTransaction as categorizeTransactionFlow } from '@/ai/flows/categorize-transaction';
import { useAuth } from '@/hooks/use-auth';
import { addTransactionToDb, getTransactions, deleteTransactionFromDb, updateTransactionInDb, getBudgets, updateBudgetInDb } from '@/lib/firestore';

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  updateBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  getCategoryByName: (name: string) => Category | undefined;
  categorizeTransaction: (description: string) => Promise<string | null>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        try {
          const [userTransactions, userBudgets] = await Promise.all([
            getTransactions(user.uid),
            getBudgets(user.uid)
          ]);
          setTransactions(userTransactions);
          setBudgets(userBudgets);
        } catch (error) {
          console.error("Failed to load user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Not logged in, clear data
        setTransactions([]);
        setBudgets([]);
        setLoading(false);
      }
    };
    loadData();
  }, [user]);


  const getCategoryByName = (name: string): Category | undefined => {
    return defaultCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) throw new Error("User not authenticated");
    
    const newTransactionData = {
      ...transaction,
      date: new Date(),
    };

    const newTransaction = await addTransactionToDb(user.uid, newTransactionData);
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
  };
  
  const updateBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!user) throw new Error("User not authenticated");
    const updatedBudget = await updateBudgetInDb(user.uid, budget);
    setBudgets(prev => {
        const existing = prev.find(b => b.category === updatedBudget.category);
        if (existing) {
            return prev.map(b => b.category === updatedBudget.category ? { ...b, amount: updatedBudget.amount } : b);
        }
        return [...prev, updatedBudget];
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

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    await deleteTransactionFromDb(id);
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    if (!user) throw new Error("User not authenticated");
    await updateTransactionInDb(updatedTransaction);
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
  }), [transactions, budgets, loading, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
