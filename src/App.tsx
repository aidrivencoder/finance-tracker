import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, TimeRange } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Summary } from './components/Summary';
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportToCSV
} from './lib/storage';

export default function App() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const queryClient = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: loadTransactions
  });

  const addMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsAddingTransaction(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (transaction: Transaction) => updateTransaction(transaction.id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setEditingTransaction(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Finance Tracker</h1>
          <div className="flex justify-between items-center mt-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="p-2 border rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={exportToCSV}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Export CSV
            </button>
          </div>
        </header>

        <Summary
          transactions={transactions}
          timeRange={timeRange}
        />

        <div className="mt-8">
          {!isAddingTransaction && !editingTransaction && (
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Add Transaction
            </button>
          )}

          {(isAddingTransaction || editingTransaction) && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <TransactionForm
                onSubmit={(data) => {
                  if (editingTransaction) {
                    updateMutation.mutate(data);
                  } else {
                    addMutation.mutate(data);
                  }
                }}
                initialData={editingTransaction || undefined}
              />
              <button
                onClick={() => {
                  setIsAddingTransaction(false);
                  setEditingTransaction(null);
                }}
                className="w-full mt-2 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mt-6">
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}