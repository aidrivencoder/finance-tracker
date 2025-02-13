import { Transaction, TransactionType } from '@/types';

const STORAGE_KEY = 'finance-tracker-data';

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function loadTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function addTransaction(transaction: Transaction): Transaction[] {
  const transactions = loadTransactions();
  const newTransactions = [...transactions, transaction];
  saveTransactions(newTransactions);
  return newTransactions;
}

export function updateTransaction(id: string, updatedTransaction: Transaction): Transaction[] {
  const transactions = loadTransactions();
  const newTransactions = transactions.map(t => 
    t.id === id ? updatedTransaction : t
  );
  saveTransactions(newTransactions);
  return newTransactions;
}

export function deleteTransaction(id: string): Transaction[] {
  const transactions = loadTransactions();
  const newTransactions = transactions.filter(t => t.id !== id);
  saveTransactions(newTransactions);
  return newTransactions;
}

export function exportToCSV(): void {
  const transactions = loadTransactions();
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