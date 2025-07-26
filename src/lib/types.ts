
export interface Transaction {
  id: string;
  userId?: string; // Add userId to associate with a user
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Budget {
  id: string;
  userId?: string; // Add userId to associate with a user
  category: string;
  amount: number;
}
