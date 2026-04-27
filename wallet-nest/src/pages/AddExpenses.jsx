import ExpenseForm from '../components/ExpenseForm';
import { Camera, Receipt } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function AddExpenses() {
  const { addExpense, monthlyBudget, setMonthlyBudget } = useFinance();

  return (
    <div className="max-w-4xl mx-auto animation-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--text-color)]">Log Expense</h2>
        <p className="text-gray-500 mt-1">Keep track of your spending to stay on top of your budget.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ExpenseForm onSubmit={addExpense} />
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 transition-colors duration-300">
            <h3 className="font-semibold text-lg text-[var(--text-color)] mb-4">Monthly Budget</h3>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(Number(event.target.value || 0))}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-[var(--text-color)] text-sm transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">Update this anytime to keep alerts and predictions accurate.</p>
          </div>
          <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 transition-colors duration-300">
            <h3 className="font-semibold text-lg text-[var(--text-color)] mb-4 flex items-center">
              <Camera className="mr-2 text-emerald-500" size={20} /> Smart Scan
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl h-40 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer group">
              <Receipt size={32} className="mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Click or drag receipt here</p>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">We'll automatically extract the amount, date, and category.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
