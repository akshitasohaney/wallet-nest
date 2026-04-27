import { Target, TrendingUp } from 'lucide-react';

export default function GoalCard({ title, current, target, color = 'emerald' }) {
  const percent = Math.min(Math.round((current / target) * 100), 100);
  
  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-3xl p-5 shadow-sm border border-[var(--border-color)] dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl text-white ${colorMap[color]} shadow-md`}>
            <Target size={18} />
          </div>
          <h4 className="font-semibold text-[var(--text-color)]">{title}</h4>
        </div>
        <span className="text-sm font-bold text-gray-500">{percent}%</span>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between text-sm mb-2 text-gray-500 dark:text-gray-400 font-medium">
          <span>${current.toLocaleString()}</span>
          <span>${target.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${colorMap[color]} rounded-full transition-all duration-1000 ease-in-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 text-xs text-gray-400 z-10 relative">
        <TrendingUp size={14} className="text-emerald-500" />
        <span>On track to reach this by Nov 2026</span>
      </div>
    </div>
  );
}
