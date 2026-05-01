import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Wallet, ShieldCheck, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-color)] text-[var(--text-color)] font-sans">
      {/* Top/Left side: Premium Branding */}
      <div className="w-full lg:w-1/2 relative bg-slate-900 overflow-hidden flex items-center justify-center py-16 lg:py-0">
        {/* Fintech graphical background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/40 to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 p-32 opacity-20 transform translate-x-1/4 -translate-y-1/4">
           {/* Big glowing orb */}
           <div className="w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-32 opacity-10 transform -translate-x-1/4 translate-y-1/4">
           <div className="w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 p-8 sm:p-16 max-w-xl text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 lg:mb-12 justify-center lg:justify-start">
             <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white border border-emerald-300/20">
                <Wallet size={24} strokeWidth={2.5} />
             </div>
             <span className="text-3xl font-black tracking-tight text-white">WalletNest</span>
           </div>
           
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
             Track smarter. <br className="hidden lg:block"/>
             <span className="text-emerald-400">Save better.</span><br/>
             Grow faster.
           </h2>
           <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
             Your financial journey starts here.
           </p>
        </div>
      </div>

      {/* Bottom/Right side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-[var(--bg-color)] relative">
        <div className="w-full max-w-md space-y-8 relative z-10">

          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 text-[var(--text-color)]">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Enter your credentials to securely access your dashboard.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-[var(--text-color)] shadow-sm dark:shadow-inner"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl py-3.5 pl-4 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-[var(--text-color)] shadow-sm dark:shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 text-gray-400 hover:text-emerald-500 transition-colors flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm font-bold tracking-tight text-red-600 dark:text-red-400 leading-tight">{error}</p>
              </div>
            )}
            
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-tight rounded-2xl py-4 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 active:scale-[0.98]" 
                disabled={authLoading}
              >
                {authLoading ? 'Authenticating...' : (
                   <>Secure Login <Lock size={16} strokeWidth={2.5} /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
            <p className="text-sm text-center font-medium text-gray-500 dark:text-gray-400">
              Don't have an account yet? <Link to="/signup" className="text-emerald-500 font-bold hover:text-emerald-600 transition-colors ml-1">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
