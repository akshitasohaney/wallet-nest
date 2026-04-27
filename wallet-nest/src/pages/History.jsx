import { History as HistoryIcon, Filter, Download } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function History() {
  const { transactions } = useFinance();

  return (
    <div className="max-w-6xl mx-auto animation-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-end mb-6 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-color)] flex items-center">
            <HistoryIcon className="mr-3 text-orange-500" size={28} />
            Transaction History
          </h2>
          <p className="text-gray-500 mt-1">Review all your past transactions.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-white/5 hover:border-emerald-500 dark:hover:border-emerald-500 text-[var(--text-color)] px-4 py-2 rounded-xl transition-all font-medium">
            <Filter size={18} /><span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500 text-[var(--text-color)] px-4 py-2 rounded-xl transition-all font-medium">
            <Download size={18} /><span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-3xl shadow-sm border border-[var(--border-color)] dark:border-white/5 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] overflow-y-auto">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-[var(--text-color)] font-medium">{tx.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-xs text-gray-600 dark:text-gray-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-emerald-500 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Completed</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${tx.amount > 0 ? 'text-emerald-500' : 'text-[var(--text-color)]'}`}>
                    {tx.amount > 0 ? '+' : ''}Rs {Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
