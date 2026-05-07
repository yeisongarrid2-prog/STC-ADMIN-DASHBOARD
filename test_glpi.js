const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  const val = rest.join('=');
  if (key && val) acc[key.trim()] = val.trim().replace(/^"|"$/g, '');
  return acc;
}, {});

async function test() {
  const url = env.NEXT_PUBLIC_GLPI_URL + '/initSession';
  console.log('URL:', url);
  try {
    const res = await fetch(url, {
      headers: {
        'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN,
        'Authorization': 'user_token ' + env.NEXT_PUBLIC_GLPI_USER_TOKEN
      }
    });
    const data = await res.json();
    console.log('Session:', data);
    
    if (data.session_token) {
      const optionsUrl = env.NEXT_PUBLIC_GLPI_URL + '/listSearchOptions/Ticket';
      const optionsRes = await fetch(optionsUrl, {
        headers: {
          'Session-Token': data.session_token,
          'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN
        }
      });
      const optionsData = await optionsRes.json();
      const relevant = Object.entries(optionsData).filter(([id, opt]) => 
        opt.name.toLowerCase().includes('solicitante') || 
        opt.name.toLowerCase().includes('técnico') ||
        opt.name.toLowerCase().includes('asignado') ||
        opt.name.toLowerCase().includes('nombre')
      );
      console.log('Relevant Search Options:', JSON.stringify(relevant, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
test();
