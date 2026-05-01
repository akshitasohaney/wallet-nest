import { supabase } from './server/config/supabase.js';

async function run() {
  const res = await supabase.from('goals').select('*');
  console.log("Goals exist:", res.data?.length);

  // Instead of querying pg_policies directly (which requires superuser), let's just try to update.
  // We already know update fails. Let's execute SQL to disable RLS or add a policy if possible.
  // Wait, the anon key cannot execute raw SQL.
  console.log("End");
}
run();
