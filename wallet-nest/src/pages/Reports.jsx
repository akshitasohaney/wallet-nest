import ChartSection from '../components/ChartSection';
import { PieChart } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function Reports() {
  const { metrics } = useFinance();
  const breakdown = Object.entries(metrics.categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const trendData = breakdown.map((item) => ({ name: item.category, spend: item.total }));

  return (
    <div className="max-w-6xl mx-auto animation-fade-in space-y-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-color)] flex items-center">
            <PieChart className="mr-3 text-purple-500" size={28} />
            Financial Reports
          </h2>
          <p className="text-gray-500 mt-1">Deep dive into your spending patterns.</p>
        </div>
      </div>

      <ChartSection title="Monthly Spending Trend" data={trendData.length ? trendData : undefined} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 h-80">
          <h3 className="font-semibold text-[var(--text-color)] mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span>{item.category}</span>
                <span className="font-semibold">Rs {item.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 h-80">
          <h3 className="font-semibold text-[var(--text-color)] mb-4">Income vs Expense</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Income</span>
              <span className="font-semibold text-emerald-500">Rs {metrics.income.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Expense</span>
              <span className="font-semibold">Rs {metrics.expenses.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
              <span>Net</span>
              <span className={`font-semibold ${metrics.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                Rs {metrics.balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
