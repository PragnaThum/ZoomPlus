import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { phoneNumbers, message } = await req.json();

    if (
      !phoneNumbers ||
      !Array.isArray(phoneNumbers) ||
      phoneNumbers.length === 0 ||
      !message
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 },
      );
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );

    const fromNumber = 'whatsapp:+14155238886'; // Sandbox number
    console.log(phoneNumbers);
    const results = await Promise.all(
      phoneNumbers.map((phone: string) =>
        client.messages.create({
          body: message, // Message body, no need for template SID here
          from: fromNumber,
          to: `whatsapp:${phone}`, // Send to each phone number via WhatsApp
        }),
      ),
    );

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Twilio Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
