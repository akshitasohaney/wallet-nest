import SummaryCards from '../components/SummaryCards';
import AlertCard from '../components/AlertCard';
import ChartSection from '../components/ChartSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinance } from '../hooks/useFinance';

export default function Dashboard() {
  const { metrics } = useFinance();
  const trendData = Object.entries(metrics.categoryTotals).map(([name, spend]) => ({ name, spend }));

  return (
    <div className="max-w-7xl mx-auto animation-fade-in space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-color)]">Welcome back, Alex! 👋</h2>
          <p className="text-gray-500 mt-1">Here is your financial overview for this week.</p>
        </div>
        <Link to="/expenses" className="hidden sm:flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 font-medium">
          <span>Add Expense</span>
        </Link>
      </div>

      <AlertCard
        title={metrics.spentPercent >= 80 ? 'Budget warning' : 'Good progress'}
        message={
          metrics.spentPercent >= 80
            ? `You already used ${metrics.spentPercent}% of your budget. Reduce impulse purchases this week.`
            : `You have used ${metrics.spentPercent}% of your budget so far. Keep tracking daily expenses.`
        }
        type="warning"
      />

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <ChartSection title="Category Spending" data={trendData.length ? trendData : undefined} />
        </div>
        
        {/* Recent Transactions Snippet */}
        <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 flex flex-col mt-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-[var(--text-color)]">Recent Activity</h3>
            <Link to="/history" className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {Object.entries(metrics.categoryTotals).slice(0, 4).map(([title, amount]) => (
              <div key={title} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-500 dark:bg-orange-500/20">
                    🛒
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--text-color)] text-sm">{title}</h4>
                    <span className="text-xs text-gray-500">This month</span>
                  </div>
                </div>
                <span className="font-semibold text-[var(--text-color)]">
                  -Rs {amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
