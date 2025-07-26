
'use client';
import { app } from './firebase';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    deleteDoc, 
    doc,
    updateDoc,
    writeBatch
} from 'firebase/firestore';
import { Transaction, Budget } from './types';

const db = getFirestore(app);

// Transactions
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({ 
            id: doc.id, 
            ...data,
            // Convert Firestore Timestamp to JS Date
            date: data.date.toDate(),
        } as Transaction);
    });
    // Sort by date descending
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id'>) => {
    const docRef = await addDoc(collection(db, "transactions"), { 
        ...transaction,
        userId,
    });
    return docRef.id;
};

export const updateTransactionInDb = async (transaction: Transaction) => {
    const { id, ...data } = transaction;
    const transactionRef = doc(db, "transactions", id);
    await updateDoc(transactionRef, data);
};

export const deleteTransactionFromDb = async (transactionId: string) => {
    await deleteDoc(doc(db, "transactions", transactionId));
};


// Budgets
export const getBudgets = async (userId: string): Promise<Budget[]> => {
    const q = query(collection(db, "budgets"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const budgets: Budget[] = [];
    querySnapshot.forEach((doc) => {
        budgets.push({ id: doc.id, ...doc.data() } as Budget);
    });
    return budgets;
};

export const updateBudgetInDb = async (userId: string, budget: Omit<Budget, 'id'>) => {
    const budgetsRef = collection(db, "budgets");
    const q = query(budgetsRef, where("userId", "==", userId), where("category", "==", budget.category));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // No existing budget, create new one
        const docRef = await addDoc(budgetsRef, { ...budget, userId });
        return { id: docRef.id, ...budget };
    } else {
        // Existing budget found, update it
        const docId = querySnapshot.docs[0].id;
        const budgetRef = doc(db, "budgets", docId);
        await updateDoc(budgetRef, { amount: budget.amount });
        return { id: docId, ...budget };
    }
};
