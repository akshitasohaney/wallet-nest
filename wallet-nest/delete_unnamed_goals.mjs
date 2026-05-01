import { supabase } from './server/config/supabase.js';

async function run() {
  const { data, error } = await supabase.from('goals').delete().is('name', null);
  console.log("Deleted goals without name:", data, error);
}
run();
