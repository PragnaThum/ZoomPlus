import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import SessionLog from '@/models/SessionLog';

export async function POST(req: Request) {
  try {
    const { subject, section } = await req.json();

    if (!subject || !section) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const db = await dbConnect();
    const Section = db.connection.collection(section);

    const logs = await SessionLog.find({ subject, section });

    const attendanceUpdates = [];

    for (const entry of logs) {
      const totalMs = entry.logs.reduce((acc: number, log: any) => {
        const joined = new Date(log.joinedAt).getTime();
        const left = new Date(log.leftAt).getTime();
        return acc + (left - joined);
      }, 0);

      const totalMinutes = totalMs / (1000 * 60);
      const status = totalMinutes >= 30 ? 'Present' : 'Absent';

      attendanceUpdates.push({
        username: entry.username,
        status,
      });

      await Section.updateOne(
        { username: entry.username },
        { $set: { [subject]: status } },
      );
    }

    return NextResponse.json({
      message: 'Attendance evaluated',
      updates: attendanceUpdates,
    });
  } catch (err: any) {
    console.error('Evaluate Attendance Error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
