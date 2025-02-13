import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1),
  date: z.string()
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: Transaction) => void;
  initialData?: Transaction;
}

export function TransactionForm({ onSubmit, initialData }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const transactionType = watch('type') as TransactionType;
  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      id: initialData?.id || crypto.randomUUID()
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="expense"
            {...register('type')}
            className="mr-2"
          />
          Expense
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="income"
            {...register('type')}
            className="mr-2"
          />
          Income
        </label>
      </div>

      <div>
        <select
          {...register('category')}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          {...register('amount')}
          className="w-full p-2 border rounded-lg"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message?.toString()}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Description"
          {...register('description')}
          className="w-full p-2 border rounded-lg"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <input
          type="date"
          {...register('date')}
          className="w-full p-2 border rounded-lg"
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        {initialData ? 'Update' : 'Add'} Transaction
      </button>
    </form>
  );
}