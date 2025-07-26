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

export const initialTransactions: Transaction[] = [];

export const initialBudgets: Budget[] = [];
