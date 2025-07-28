import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import MeetingRoom from '@/models/MeetingRoom';

export async function GET(
  _: Request,
  { params }: { params: { meetingId: string } },
) {
  await dbConnect();
  const meeting = await MeetingRoom.findOne({ meetingId: params.meetingId });

  return NextResponse.json({
    allowChatbot: meeting?.allowChatbot ?? false,
  });
}
