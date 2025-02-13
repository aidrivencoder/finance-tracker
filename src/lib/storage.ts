import { Transaction } from '@/types';

const STORAGE_KEY = 'finance-tracker-data';

export function saveTransactions(transactions: Transaction[]): Promise<void> {
  return Promise.resolve(localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)));
}

export function loadTransactions(): Promise<Transaction[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  return Promise.resolve(data ? JSON.parse(data) : []);
}

export async function addTransaction(transaction: Transaction): Promise<Transaction> {
  const transactions = await loadTransactions();
  const newTransactions = [...transactions, transaction];
  await saveTransactions(newTransactions);
  return transaction;
}

export async function updateTransaction(id: string, updatedTransaction: Transaction): Promise<Transaction> {
  const transactions = await loadTransactions();
  const newTransactions = transactions.map(t => 
    t.id === id ? updatedTransaction : t
  );
  await saveTransactions(newTransactions);
  return updatedTransaction;
}

export async function deleteTransaction(id: string): Promise<string> {
  const transactions = await loadTransactions();
  const newTransactions = transactions.filter(t => t.id !== id);
  await saveTransactions(newTransactions);
  return id;
}

export async function exportToCSV(): Promise<void> {
  const transactions = await loadTransactions();
  const csvContent = [
    ['Date', 'Type', 'Category', 'Amount', 'Description'].join(','),
    ...transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount,
      `"${t.description}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `finance-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}