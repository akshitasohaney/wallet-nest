import { Wallet, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

const formatCurrency = (value) => `Rs ${value.toLocaleString()}`;

export default function SummaryCards() {
  const { metrics, monthlyBudget } = useFinance();
  const cards = [
    { title: 'Current Balance', amount: formatCurrency(metrics.balance), trend: 'income - expenses', icon: Wallet },
    { title: 'Monthly Income', amount: formatCurrency(metrics.income), trend: 'all credits', icon: ArrowUpRight },
    { title: 'Monthly Expenses', amount: formatCurrency(metrics.expenses), trend: `${metrics.spentPercent}% of budget`, icon: ArrowDownRight },
    { title: 'Budget Remaining', amount: formatCurrency(metrics.remaining), trend: `of Rs ${monthlyBudget.toLocaleString()}`, icon: Target },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] dark:border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-[var(--text-color)]">{card.amount}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg">
              <card.icon size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 z-10 relative">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
