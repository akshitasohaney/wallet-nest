import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://lqtcgaynzxqilrwytbmi.supabase.co', 'sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI');

async function checkSettings() {
  const { data, error } = await supabase.from('user_settings').select('*');
  console.log('user_settings rows:', data ? data.length : error);
  if (data) {
    console.log(data);
  }
}
checkSettings();
