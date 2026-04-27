import ChatMentorBox from '../components/ChatMentorBox';
import { Sparkles, TrendingDown, BookOpen, Search, Activity } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function AIInsights() {
  const { metrics } = useFinance();
  const topCategories = Object.entries(metrics.categoryTotals).sort((a, b) => b[1] - a[1]);
  const safeCategory = topCategories.length > 0 ? `${topCategories[0][0]} (Rs ${topCategories[0][1].toLocaleString()})` : 'no spending data yet';

  // Sample data logic
  const burnRate = metrics.spentPercent;
  const survivalStatus = burnRate > 85 ? 'Danger ⚠️' : burnRate > 60 ? 'Moderate 🟡' : 'Safe 🟢';

  return (
    <div className="max-w-6xl mx-auto animation-fade-in flex flex-col gap-6">
      <div className="flex-shrink-0">
        <h2 className="text-3xl font-bold text-[var(--text-color)] flex items-center tracking-tight">
          <Sparkles className="mr-3 text-emerald-500" size={28} />
          AI Mentor Insights
        </h2>
        <p className="text-gray-500 mt-1">Smarter insights. Prevent overspending before it happens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Where did money go */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-blue-500" size={20} />
            <h3 className="font-semibold text-[var(--text-color)] tracking-tight">Where's it going?</h3>
          </div>
          <div className="space-y-3">
            {topCategories.slice(0,3).map(([title, amount]) => (
              <div key={title} className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{title}</span>
                <span className="font-medium text-[var(--text-color)]">Rs {amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Survival Predictor */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-purple-500" size={20} />
            <h3 className="font-semibold text-[var(--text-color)] tracking-tight">Survival Predictor</h3>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Burn Rate</span>
            <span className="font-bold text-[var(--text-color)]">{burnRate}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${burnRate > 85 ? 'bg-red-500' : burnRate > 60 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(burnRate, 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-500">Status: <span className="font-semibold text-[var(--text-color)]">{survivalStatus}</span></p>
        </div>

        {/* Module 3: Overspending Alert */}
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 shadow-md text-white transform hover:-translate-y-1 transition-transform duration-300">
          <TrendingDown className="mb-4 opacity-80" size={24} />
          <h3 className="font-bold text-lg mb-2">Overspending Alert</h3>
          <p className="text-red-100 text-sm">
            Your highest spend is {safeCategory}. Those late-night runs are adding up! Try a weekly cap. 🍕
          </p>
        </div>

        {/* Module 4: Smart Tips */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-md text-white transform hover:-translate-y-1 transition-transform duration-300">
          <BookOpen className="mb-4 opacity-80" size={24} />
          <h3 className="font-bold text-lg mb-2">Smart Saving Tip</h3>
          <p className="text-blue-100 text-sm">
            Predicted end balance is Rs {metrics.predictedMonthEnd.toLocaleString()}. Auto-transfer a slice to your "Spring Break" fund!
          </p>
        </div>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold text-xl text-[var(--text-color)] mb-4">
          Chat with your Financial Mentor
        </h3>
        <div className="h-[400px]">
          <ChatMentorBox />
        </div>
      </div>
    </div>
  );
}
