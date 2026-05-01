import { supabase } from './server/config/supabase.js';

async function run() {
  const insertRes = await supabase.from('goals').insert({ user_id: 'c01ae302-c15e-40ba-b89b-e186ccf7f362', target: 500, saved: 0, name: 'Test' }).select();
  console.log("Insert result:", insertRes);
}
run();
