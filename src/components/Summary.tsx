import React from 'react';
import { Transaction, TimeRange } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  transactions: Transaction[];
  timeRange: TimeRange;
}

export function Summary({ transactions, timeRange }: Props) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const chartData = [
    { name: 'Income', amount: income },
    { name: 'Expenses', amount: expenses }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Income</p>
          <p className="text-lg font-bold text-green-600">
            ${income.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Expenses</p>
          <p className="text-lg font-bold text-red-600">
            ${expenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Balance</p>
          <p className={`text-lg font-bold ${
            balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}