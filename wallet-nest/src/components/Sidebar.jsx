import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BrainCircuit, Target, PieChart, History, Wallet } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Add Expenses', path: '/expenses', icon: Receipt },
  { name: 'AI Insights', path: '/insights', icon: BrainCircuit },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Reports', path: '/reports', icon: PieChart },
  { name: 'History', path: '/history', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col hidden md:flex transition-colors duration-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-emerald-500/50 shadow-lg flex items-center justify-center text-white">
          <Wallet size={24} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
          Wallet Nest
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-[var(--border-color)]">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <p className="text-sm font-medium relative z-10">Pro Plan</p>
          <p className="text-xs opacity-90 relative z-10">Unlock all features</p>
        </div>
      </div>
    </aside>
  );
}
