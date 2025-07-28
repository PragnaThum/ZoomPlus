//!keep track of the join/leave time
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import SessionLog from '@/models/SessionLog';

export async function POST(req: Request) {
  try {
    const { username, subject, section, joinedAt, leftAt } = await req.json();

    if (!username || !subject || !section || !joinedAt || !leftAt) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    await dbConnect();

    await SessionLog.updateOne(
      { username, subject, section },
      {
        $push: {
          logs: {
            joinedAt: new Date(joinedAt),
            leftAt: new Date(leftAt),
          },
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ message: 'Log updated' });
  } catch (err: any) {
    console.error('Session Log Error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
