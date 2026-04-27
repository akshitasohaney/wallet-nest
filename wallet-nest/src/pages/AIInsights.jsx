import ChatMentorBox from '../components/ChatMentorBox';
import { Sparkles, TrendingDown, BookOpen } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function AIInsights() {
  const { metrics } = useFinance();
  const topCategory = Object.entries(metrics.categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const safeCategory = topCategory ? `${topCategory[0]} (Rs ${topCategory[1].toLocaleString()})` : 'no spending data yet';

  return (
    <div className="max-w-5xl mx-auto animation-fade-in flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-bold text-[var(--text-color)] flex items-center">
          <Sparkles className="mr-3 text-blue-500" size={28} />
          AI Mentor Insights
        </h2>
        <p className="text-gray-500 mt-1">Get personalized financial advice based on your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="md:col-span-2 flex flex-col">
          <ChatMentorBox />
        </div>
        
        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 shadow-md text-white">
            <TrendingDown className="mb-4 opacity-80" size={24} />
            <h3 className="font-bold text-lg mb-2">Spending Alert</h3>
            <p className="text-emerald-100 text-sm">
              Highest spending area this month is {safeCategory}. Consider setting a weekly cap to avoid month-end crunch.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-md text-white">
            <BookOpen className="mb-4 opacity-80" size={24} />
            <h3 className="font-bold text-lg mb-2">Learn: High-Yield Savings</h3>
            <p className="text-blue-100 text-sm">
              Your predicted month-end balance is Rs {metrics.predictedMonthEnd.toLocaleString()}. Auto-transfer a small fixed amount to savings right after any income credit.
            </p>
            <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20 w-full">
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
