import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://lqtcgaynzxqilrwytbmi.supabase.co', 'sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI');

async function test() {
  const { data: gData, error: gErr } = await supabase.from('goals').select('*').limit(1);
  console.log('Goals columns:', gData ? Object.keys(gData[0] || {}) : gErr);
  
  const { data: eData, error: eErr } = await supabase.from('expenses').select('*').limit(1);
  console.log('Expenses columns:', eData ? Object.keys(eData[0] || {}) : eErr);
}
test();
