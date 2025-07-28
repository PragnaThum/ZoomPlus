import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await res.json();

    // Log the full response for debugging
    console.log('[Gemini raw response]', JSON.stringify(data, null, 2));

    if (data.candidates?.length > 0) {
      const message =
        data.candidates[0].content?.parts?.[0]?.text || '⚠️ Empty response';
      return NextResponse.json({ message });
    }

    return NextResponse.json(
      { message: '⚠️ No valid response from Gemini.' },
      { status: 500 },
    );
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json(
      { message: '🚨 Gemini API request failed' },
      { status: 500 },
    );
  }
}
