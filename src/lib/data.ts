import { type Transaction, type Category, type Budget } from '@/lib/types';
import { Home, Utensils, Car, ShoppingBag, Shirt, HeartPulse, Film, BookOpen, Gift, PawPrint, Landmark } from 'lucide-react';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Housing', icon: Home },
  { id: 'cat-2', name: 'Food', icon: Utensils },
  { id: 'cat-3', name: 'Transportation', icon: Car },
  { id: 'cat-4', name: 'Shopping', icon: ShoppingBag },
  { id: 'cat-5', name: 'Clothing', icon: Shirt },
  { id: 'cat-6', name: 'Health', icon: HeartPulse },
  { id: 'cat-7', name: 'Entertainment', icon: Film },
  { id: 'cat-8', name: 'Education', icon: BookOpen },
  { id: 'cat-9', name: 'Gifts', icon: Gift },
  { id: 'cat-10', name: 'Pets', icon: PawPrint },
  { id: 'cat-11', name: 'Other', icon: Gift },
  { id: 'cat-12', name: 'Income', icon: Landmark },
];

export const initialTransactions: Transaction[] = [
  { id: 'txn-1', date: new Date(2024, 6, 1), description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Income' },
  { id: 'txn-2', date: new Date(2024, 6, 2), description: 'Grocery shopping at Whole Foods', amount: 150.75, type: 'expense', category: 'Food' },
  { id: 'txn-3', date: new Date(2024, 6, 3), description: 'Gasoline for car', amount: 60, type: 'expense', category: 'Transportation' },
  { id: 'txn-4', date: new Date(2024, 6, 5), description: 'Rent payment', amount: 1200, type: 'expense', category: 'Housing' },
  { id: 'txn-5', date: new Date(2024, 6, 7), description: 'Dinner with friends at Italian place', amount: 85.50, type: 'expense', category: 'Food' },
  { id: 'txn-6', date: new Date(2024, 6, 10), description: 'New pair of running shoes from Nike', amount: 120, type: 'expense', category: 'Clothing' },
  { id: 'txn-7', date: new Date(2024, 6, 15), description: 'Movie tickets for "Dune: Part Two"', amount: 30, type: 'expense', category: 'Entertainment' },
  { id: 'txn-8', date: new Date(2024, 6, 20), description: 'Freelance project payment', amount: 750, type: 'income', category: 'Income' },
  { id: 'txn-9', date: new Date(2024, 6, 22), description: 'Pharmacy purchase', amount: 45.20, type: 'expense', category: 'Health' },
  { id: 'txn-10', date: new Date(2024, 6, 25), description: 'Online course subscription on Coursera', amount: 50, type: 'expense', category: 'Education' },
];

export const initialBudgets: Budget[] = [
    { id: 'bud-1', category: 'Food', amount: 500 },
    { id: 'bud-2', category: 'Transportation', amount: 150 },
    { id: 'bud-3', category: 'Shopping', amount: 200 },
    { id: 'bud-4', category: 'Entertainment', amount: 100 },
];
