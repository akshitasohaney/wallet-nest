import { Send, Bot } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function ChatMentorBox() {
  const { metrics } = useFinance();

  return (
    <div className="card-premium flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center space-x-3 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 dark:from-blue-900/20 dark:to-emerald-900/20">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Bot size={20} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-color)]">Nest AI Mentor</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Online & ready to help</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Bot Message */}
        <div className="flex items-start space-x-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Bot size={16} />
          </div>
          <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-[var(--text-color)] shadow-sm">
            You have spent Rs {metrics.expenses.toLocaleString()} this month and have Rs {metrics.remaining.toLocaleString()} budget left.
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-start space-x-3 max-w-[85%] ml-auto justify-end">
          <div className="bg-emerald-500 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-md shadow-emerald-500/20">
            What should I do to avoid overspending near month end?
          </div>
          <div className="w-8 h-8 rounded-full border border-emerald-500 p-0.5 shrink-0 bg-emerald-100 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=10b981" alt="User" />
          </div>
        </div>

        {/* Bot Message */}
        <div className="flex items-start space-x-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Bot size={16} />
          </div>
          <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-[var(--text-color)] shadow-sm">
            Try a 50-30-20 split on new income and set a low weekly cap for your top category. Small controls now reduce stress later.
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-color)] bg-white dark:bg-[#0f172a]">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask about your finances..." 
            className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-[var(--text-color)] transition-all"
          />
          <button className="absolute right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-md">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
