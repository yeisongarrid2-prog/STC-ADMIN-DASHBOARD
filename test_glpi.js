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
      const searchUrl = env.NEXT_PUBLIC_GLPI_URL + '/search/Ticket?range=0-10';
      const searchRes = await fetch(searchUrl, {
        headers: {
          'Session-Token': data.session_token,
          'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN
        }
      });
      const searchData = await searchRes.json();
      console.log('Total Tickets count:', searchData.totalcount);
      
      const search2026Url = env.NEXT_PUBLIC_GLPI_URL + '/search/Ticket?criteria[0][field]=15&criteria[0][searchtype]=morethan&criteria[0][value]=2026-01-01 00:00:00';

      const search2026Res = await fetch(search2026Url, {
        headers: {
          'Session-Token': data.session_token,
          'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN
        }
      });
      const search2026Data = await search2026Res.json();
      console.log('Tickets 2026 response:', search2026Data);

    }
  } catch (e) {
    console.error(e);
  }
}
test();
