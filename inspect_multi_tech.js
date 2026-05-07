const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  const val = rest.join('=');
  if (key && val) acc[key.trim()] = val.trim().replace(/^"|"$/g, '');
  return acc;
}, {});

async function test() {
  const url = env.NEXT_PUBLIC_GLPI_URL + '/initSession';
  try {
    const res = await fetch(url, {
      headers: {
        'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN,
        'Authorization': 'user_token ' + env.NEXT_PUBLIC_GLPI_USER_TOKEN
      }
    });
    const data = await res.json();
    
    if (data.session_token) {
      // Buscar el ticket 2855 especificamente para ver sus tecnicos
      const searchUrl = env.NEXT_PUBLIC_GLPI_URL + '/search/Ticket?expand_dropdowns=1&criteria[0][field]=2&criteria[0][searchtype]=equals&criteria[0][value]=2855';
      const searchRes = await fetch(searchUrl, {
        headers: {
          'Session-Token': data.session_token,
          'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN
        }
      });
      const searchData = await searchRes.json();
      console.log('Ticket 2855 Data:', JSON.stringify(searchData.data[0], null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
test();
