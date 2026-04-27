import { useState } from 'react';
import GoalCard from '../components/GoalCard';
import { Target, Plus } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function Goals() {
  const { goals, addGoal } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const submitGoal = (event) => {
    event.preventDefault();
    if (!title.trim() || !target) return;
    addGoal({ title, target });
    setTitle('');
    setTarget('');
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto animation-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-color)] flex items-center">
            <Target className="mr-3 text-emerald-500" size={28} />
            Savings Goals
          </h2>
          <p className="text-gray-500 mt-1">Track your progress and stay motivated.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center space-x-2 bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-white/5 hover:border-emerald-500 dark:hover:border-emerald-500 text-[var(--text-color)] px-4 py-2 rounded-xl transition-all font-medium shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitGoal} className="mb-6 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Goal title"
            className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 px-3 outline-none"
          />
          <input
            type="number"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="Target"
            className="w-40 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 px-3 outline-none"
          />
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-xl">Save</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, idx) => (
          <GoalCard key={goal.id ?? idx} title={goal.title} current={goal.saved} target={goal.target} />
        ))}
      </div>
    </div>
  );
}
