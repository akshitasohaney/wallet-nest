import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page placeholders
import Dashboard from './pages/Dashboard';
import AddExpenses from './pages/AddExpenses';
import AIInsights from './pages/AIInsights';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import History from './pages/History';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <div className="flex h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/expenses" element={<AddExpenses />} />
                  <Route path="/insights" element={<AIInsights />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
