/**
 * Cliente para comunicación con GLPI a través del proxy local.
 */

const APP_TOKEN = process.env.NEXT_PUBLIC_GLPI_APP_TOKEN || "";
const USER_TOKEN = process.env.NEXT_PUBLIC_GLPI_USER_TOKEN || "";
const PROXY_URL = '/api/glpi';

const memoryCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos

export async function glpiFetch(path: string, options: RequestInit & { skipCache?: boolean } = {}) {
  const isGetRequest = !options.method || options.method === 'GET';
  const cacheKey = `${PROXY_URL}/${path}`;

  if (isGetRequest && !options.skipCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
       return JSON.parse(JSON.stringify(cached.data));
    }
  }

  let sessionToken = typeof window !== 'undefined' ? localStorage.getItem('glpi_session') : null;

  // Auto-login
  if (!sessionToken && path !== 'initSession') {
    try {
      const initRes = await fetch(`${PROXY_URL}/initSession`, {
        method: 'GET',
        headers: {
          'App-Token': APP_TOKEN,
          'Authorization': `user_token ${USER_TOKEN}`
        },
        cache: 'no-store'
      });

      if (!initRes.ok) throw new Error('Fallo al obtener sesión de GLPI');
      
      const initData = await initRes.json();
      sessionToken = initData.session_token;
      
      if (typeof window !== 'undefined' && sessionToken) {
        localStorage.setItem('glpi_session', sessionToken);
      }
    } catch (error) {
      console.error("Error en auto-login de GLPI:", error);
      throw new Error("No se pudo conectar con GLPI.");
    }
  }

  const url = `${PROXY_URL}/${path.replace(/^\//, '')}`;
  const headers = new Headers(options.headers);
  
  headers.set('App-Token', APP_TOKEN);
  if (sessionToken) headers.set('Session-Token', sessionToken);
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions = { ...options };
  delete fetchOptions.skipCache;

  try {
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
      cache: 'no-store'
    });

    // Retry if session expired
    if (response.status === 401 && path !== 'initSession') {
      if (typeof window !== 'undefined') localStorage.removeItem('glpi_session');
      
      const retryInit = await fetch(`${PROXY_URL}/initSession`, {
        method: 'GET',
        headers: { 'App-Token': APP_TOKEN, 'Authorization': `user_token ${USER_TOKEN}` },
        cache: 'no-store'
      });

      if (retryInit.ok) {
        const retryData = await retryInit.json();
        const newToken = retryData.session_token;
        if (newToken) {
          if (typeof window !== 'undefined') localStorage.setItem('glpi_session', newToken);
          const retryHeaders = new Headers(headers);
          retryHeaders.set('Session-Token', newToken);
          response = await fetch(url, { ...fetchOptions, headers: retryHeaders, cache: 'no-store' });
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    const result = contentType?.includes("application/json") ? await response.json() : await response.text();

    if (isGetRequest) {
        memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;

  } catch (error: any) {
    console.error("glpiFetch Error:", error);
    throw error;
  }
}
