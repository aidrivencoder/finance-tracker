import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, TimeRange } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Summary } from './components/Summary';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const queryClient = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => loadTransactions()
  });

  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsAddingTransaction(false);
    }
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (transaction: Transaction) => 
      updateTransaction(transaction.id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setEditingTransaction(null);
    }
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const handleTransactionAction = () => {
    setIsAddingTransaction(true);
    setIsSummaryExpanded(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Finance Tracker</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              >
                Export CSV
              </button>
              {!isAddingTransaction && !editingTransaction && (
                <button
                  onClick={handleTransactionAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Add Transaction
                </button>
              )}
            </div>
          </div>
        </motion.header>

        <div className="mb-6">
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span className="text-lg font-semibold">
              {isSummaryExpanded ? '▼' : '▶'} Analytics
            </span>
          </button>
          <AnimatePresence>
            {isSummaryExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Summary
                  transactions={transactions}
                  timeRange={timeRange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(isAddingTransaction || editingTransaction) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <TransactionForm
                  onSubmit={(data) => {
                    if (editingTransaction) {
                      updateTransactionMutation.mutate(data);
                    } else {
                      addTransactionMutation.mutate(data);
                    }
                  }}
                  initialData={editingTransaction || undefined}
                />
                <button
                  onClick={() => {
                    setIsAddingTransaction(false);
                    setEditingTransaction(null);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={(id) => deleteTransactionMutation.mutate(id)}
          />
        </motion.div>
      </div>
    </div>
  );
}