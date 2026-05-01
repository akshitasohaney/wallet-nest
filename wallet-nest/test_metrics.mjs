import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://lqtcgaynzxqilrwytbmi.supabase.co', 'sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI');

async function test() {
  const { data: expRes } = await supabase.from('expenses').select('id, user_id, title, amount, category, created_at').order('created_at', { ascending: false });
  
  if (!expRes) {
    console.log('No expenses fetched');
    return;
  }
  
  const transactions = expRes.map(r => ({
    id: r.id,
    title: r.title,
    amount: Number(r.amount),
    category: r.category,
    date: r.created_at,
  }));
  
  console.log('Mapped transactions:', transactions);
  
  const isInCurrentMonth = (dateValue) => {
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return false;
    const now = new Date();
    return (
      parsed.getFullYear() === now.getFullYear()
      && parsed.getMonth() === now.getMonth()
    );
  };
  
  const monthTransactions = transactions.filter(tx => isInCurrentMonth(tx.date));
  const monthExpenses = monthTransactions.filter(tx => tx.amount < 0);
  
  console.log('Month transactions:', monthTransactions.length);
  console.log('Month expenses:', monthExpenses.length);
  console.log('Total spend:', monthExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0));
}

test();
