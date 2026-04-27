import { useTheme } from '../hooks/useTheme';
import { Moon, Sun, Bell, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-20 px-6 md:px-10 bg-[var(--bg-color)]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative text-gray-600 dark:text-gray-300">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center space-x-2.5 border-l border-[var(--border-color)] pl-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.name || 'Student')}&backgroundColor=10b981`}
            alt="User profile"
            className="w-9 h-9 rounded-full border border-emerald-500 p-0.5 object-cover bg-emerald-100"
          />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-[var(--text-color)]">{user?.name ?? 'Student'}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-emerald-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
