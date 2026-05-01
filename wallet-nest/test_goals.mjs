import { supabase } from './server/config/supabase.js';

async function run() {
  const goalsRes = await supabase.from('goals').select('*');
  console.log("Goals:", goalsRes.data);
  
  if (goalsRes.data && goalsRes.data.length > 0) {
    const testId = goalsRes.data[0].id;
    console.log("Updating goal", testId, "to saved = 999");
    const updateRes = await supabase.from('goals').update({ saved: 999 }).eq('id', testId).select();
    console.log("Update result:", updateRes);
  }
}
run();
