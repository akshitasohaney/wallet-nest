import { supabase } from './server/config/supabase.js';

async function run() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'goals' }).catch(() => ({}));
  console.log("RPC Error:", error);
  // Alternative way to fetch policies if rpc is not defined
  const { data: policies, error: polErr } = await supabase.from('pg_policies').select('*').eq('tablename', 'goals').catch(() => ({}));
  console.log("Policies:", policies, polErr);
}
run();
