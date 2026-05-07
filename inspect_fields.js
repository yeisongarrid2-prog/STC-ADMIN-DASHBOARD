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
      const searchUrl = env.NEXT_PUBLIC_GLPI_URL + '/search/Ticket?expand_dropdowns=1&range=0-100';
      const searchRes = await fetch(searchUrl, {
        headers: {
          'Session-Token': data.session_token,
          'App-Token': env.NEXT_PUBLIC_GLPI_APP_TOKEN
        }
      });
      const searchData = await searchRes.json();
      const ticket = searchData.data.find(t => t['5'] !== null);
      if (ticket) {
        console.log('Fields in ticket with tech:', JSON.stringify(ticket, null, 2));
      } else {
        console.log('No ticket with tech found in first 100.');
      }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
