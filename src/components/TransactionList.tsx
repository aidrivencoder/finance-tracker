import React from 'react';
import { Transaction } from '@/types';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="font-medium">{transaction.category}</p>
            <p className="text-sm text-gray-600">{transaction.description}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}