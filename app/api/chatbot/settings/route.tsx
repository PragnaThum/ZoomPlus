import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose'; // adjust this based on your path
import MeetingRoom from '@/models/MeetingRoom';

export async function POST(req: Request) {
  const { meetingId, allowChatbot } = await req.json();
  await dbConnect();

  try {
    await MeetingRoom.findOneAndUpdate(
      { meetingId },
      { allowChatbot },
      { new: true },
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update chatbot setting' },
      { status: 500 },
    );
  }
}
