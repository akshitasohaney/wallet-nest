async function getSpec() {
  const res = await fetch('https://lqtcgaynzxqilrwytbmi.supabase.co/rest/v1/?apikey=sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI');
  const data = await res.json();
  console.log('Goals properties:', Object.keys(data.definitions?.goals?.properties || {}));
  console.log('Expenses properties:', Object.keys(data.definitions?.expenses?.properties || {}));
}
getSpec();
