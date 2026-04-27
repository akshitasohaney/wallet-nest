import { useState } from 'react';
import { Plus, Coffee, ShoppingBag, Utensils, Book } from 'lucide-react';

const categories = [
  { name: 'Food', icon: Utensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/20' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/20' },
  { name: 'Coffee', icon: Coffee, color: 'text-amber-700 bg-amber-100 dark:bg-amber-700/20' },
  { name: 'Books', icon: Book, color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/20' }
];

export default function ExpenseForm({ onSubmit }) {
  const [activeCategory, setActiveCategory] = useState(categories[0].name);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onSubmit({
      ...form,
      category: activeCategory,
    });
    setForm((prev) => ({ ...prev, title: '', amount: '' }));
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 transition-colors duration-300">
      <h3 className="font-semibold text-lg text-[var(--text-color)] mb-4">Quick Add Expense</h3>
      
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Example: College canteen lunch"
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-[var(--text-color)] text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="0.00"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none text-xl font-semibold text-[var(--text-color)] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</label>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[80px] transition-all border ${
                  activeCategory === cat.name 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                    : 'border-transparent bg-gray-50 dark:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-full mb-2 ${cat.color}`}>
                  <cat.icon size={18} />
                </div>
                <span className="text-xs font-medium text-[var(--text-color)]">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Note (Optional)</label>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-[var(--text-color)] text-sm transition-all"
          />
        </div>

        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3 font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50">
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </form>
    </div>
  );
}
