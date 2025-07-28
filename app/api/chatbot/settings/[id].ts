// /api/chatbot/settings/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
//import { getServerSession } from 'next-auth';
import dbconnect from '@/lib/mongoose';
import Meeting from '@/models/MeetingRoom';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
  } = req;

  await dbconnect();

  try {
    const meeting = await Meeting.findOne({ meetingId: id });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    return res
      .status(200)
      .json({ allowChatbot: meeting.allowChatbot ?? false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
