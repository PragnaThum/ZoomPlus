// // ✅ /app/api/attendance/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';

// export async function POST(req: Request) {
//   try {
//     const { username, subject } = await req.json();

//     if (!username || !subject) {
//       return NextResponse.json({ error: 'Missing data' }, { status: 400 });
//     }

//     const db = await dbConnect();

//     const cseA = db.connection.collection('cse-a');
//     const cseB = db.connection.collection('cse-b');

//     const userA = await cseA.findOne({ username });
//     const userB = await cseB.findOne({ username });

//     let sectionCollection;
//     if (userA) sectionCollection = cseA;
//     else if (userB) sectionCollection = cseB;
//     else {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const trimmedSubject = subject.trim().toLowerCase();

//     // Check if column already exists
//     const alreadyExists = await sectionCollection.findOne({
//       [trimmedSubject]: { $exists: true },
//     });

//     if (!alreadyExists) {
//       // Set everyone to Absent first
//       await sectionCollection.updateMany(
//         {},
//         { $set: { [trimmedSubject]: 'Absent' } },
//       );
//     }

//     // Mark this user Present
//     await sectionCollection.updateOne(
//       { username },
//       { $set: { [trimmedSubject]: 'Present' } },
//     );

//     return NextResponse.json({ message: 'Attendance marked' }, { status: 200 });
//   } catch (err: any) {
//     console.error('Attendance Error:', err.message);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// ✅ /app/api/attendance/route.ts// ✅ /app/api/attendance/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';

export async function POST(req: Request) {
  try {
    const {
      username,
      subject,
      markPresent = true,
      meetingDate,
    } = await req.json();

    if (!username || !subject) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const db = await dbConnect();

    const cseA = db.connection.collection('cse-a');
    const cseB = db.connection.collection('cse-b');

    const userA = await cseA.findOne({ username });
    const userB = await cseB.findOne({ username });

    let sectionCollection;
    if (userA) sectionCollection = cseA;
    else if (userB) sectionCollection = cseB;
    else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const trimmedSubject = subject.trim().toLowerCase();

    // 🔁 Check if subject column already exists
    const subjectExists = await sectionCollection.findOne({
      [trimmedSubject]: { $exists: true },
    });
    if (meetingDate) {
      await sectionCollection.updateOne(
        { username },
        { $set: { meetingDate: new Date(meetingDate) } },
      );
    }

    // ✅ If column doesn't exist, create it with all 'Absent'
    if (!subjectExists) {
      await sectionCollection.updateMany(
        {},
        { $set: { [trimmedSubject]: 'Absent' } },
      );
      console.log(
        `✅ Created column "${trimmedSubject}" and marked Absent for all`,
      );
    }

    if (markPresent) {
      await sectionCollection.updateOne(
        { username },
        { $set: { [trimmedSubject]: 'Present' } },
      );
      console.log(`✅ Marked ${username} as Present`);
    }

    return NextResponse.json(
      { message: 'Attendance processed' },
      { status: 200 },
    );
  } catch (err: any) {
    console.error('Attendance Error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
