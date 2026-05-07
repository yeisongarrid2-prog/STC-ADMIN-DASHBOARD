import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API Key provided and no default key configured on server.' },
        { status: 401 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptText = `
      Eres un agente de soporte de TI de nivel empresarial.
      Mejora la siguiente respuesta para que suene más profesional, empática, clara y orientada a la resolución.
      Corrige la ortografía y gramática. 
      Si el texto original tiene formato HTML, mantenlo.
      Devuelve SOLO el resultado mejorado en texto con saltos de línea HTML (<br/>) si son necesarios, sin código markdown ni explicaciones adicionales:

      ${text}
    `;

    const result = await model.generateContent(promptText);
    const enhancedHtml = result.response.text();

    let cleanHtml = enhancedHtml.replace(/```html/gi, '').replace(/```/g, '').trim();

    return NextResponse.json({ text: cleanHtml });
  } catch (error) {
    console.error('Error enhancing text:', error);
    return NextResponse.json(
      { error: 'Error al procesar el texto con Gemini' },
      { status: 500 }
    );
  }
}
