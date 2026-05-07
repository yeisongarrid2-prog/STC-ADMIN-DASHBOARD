import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRequest(req: NextRequest, method: string) {
  try {
    const fullUrl = req.url;
    const pathPart = fullUrl.split('/api/glpi/')[1] || '';
    
    const glpiUrl = (process.env.NEXT_PUBLIC_GLPI_URL || "https://glpi.stcommunication.net/apirest.php").trim().replace(/\/$/, "");
    const targetUrl = `${glpiUrl}/${pathPart}`;

    const headers = new Headers();
    if (req.headers.has('App-Token')) headers.set('App-Token', req.headers.get('App-Token') as string);
    if (req.headers.has('Authorization')) headers.set('Authorization', req.headers.get('Authorization') as string);
    if (req.headers.has('Session-Token')) headers.set('Session-Token', req.headers.get('Session-Token') as string);
    
    const clientAccept = req.headers.get('Accept');
    if (clientAccept && clientAccept !== '*/*') {
      headers.set('Accept', clientAccept);
    } else {
      headers.set('Accept', 'application/json');
    }
    
    const originalContentType = req.headers.get('Content-Type');
    if (originalContentType && !originalContentType.includes('multipart/form-data')) {
      headers.set('Content-Type', originalContentType);
    }
    
    // Ngrok bypass if needed
    headers.set('ngrok-skip-browser-warning', 'true');

    let bodyData: RequestInit['body'] = undefined;
    
    if (method !== 'GET' && method !== 'HEAD') {
        if (originalContentType && originalContentType.includes('multipart/form-data')) {
             const formData = await req.formData();
             bodyData = formData;
        } else {
             const rawBody = await req.text();
             if (rawBody) {
               bodyData = rawBody;
             }
        }
    }

    const response = await fetch(targetUrl, {
      method: method,
      headers: headers,
      body: bodyData,
      cache: 'no-store'
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
        const buffer = await response.arrayBuffer();
        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', contentType);
        const disposition = response.headers.get('content-disposition');
        if (disposition) responseHeaders.set('Content-Disposition', disposition);
        
        return new NextResponse(buffer, {
            status: response.status,
            headers: responseHeaders
        });
    }

    const responseText = await response.text();
    
    return new NextResponse(responseText, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error(`Error crítico en Proxy GLPI [${method}]:`, error);
    return NextResponse.json(
      { 
        error: 'El servidor intermedio no pudo conectar con el GLPI.', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleRequest(req, 'POST');
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, 'PUT');
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, 'DELETE');
}
