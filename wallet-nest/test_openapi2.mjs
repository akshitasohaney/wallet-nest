async function getSpec() {
  const res = await fetch('https://lqtcgaynzxqilrwytbmi.supabase.co/rest/v1/?apikey=sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI');
  const data = await res.json();
  console.log('Tables:', Object.keys(data.definitions || {}));
  if (data.definitions?.goals) console.log('goals:', Object.keys(data.definitions.goals.properties));
}
getSpec();
