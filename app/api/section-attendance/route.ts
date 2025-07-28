// // // /app/api/section-attendance/route.ts
// // import { NextResponse } from 'next/server';
// // import dbConnect from '@/lib/mongoose';
// // import mongoose from 'mongoose';

// // export async function POST(req: Request) {
// //   try {
// //     const { sectionName } = await req.json();
// //     if (!sectionName) {
// //       return NextResponse.json(
// //         { error: 'Section name required' },
// //         { status: 400 },
// //       );
// //     }

// //     await dbConnect();

// //     // Dynamically get model for section
// //     const SectionModel = mongoose.model(
// //       sectionName,
// //       new mongoose.Schema({}, { strict: false }),
// //       sectionName,
// //     );

// //     const records = await SectionModel.find({}).lean();

// //     return NextResponse.json({ data: records }, { status: 200 });
// //   } catch (err: any) {
// //     console.error('Error fetching section attendance:', err.message);
// //     return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
// //   }
// // }

// // /app/api/section-attendance/route.ts
// // /app/api/section-attendance/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';
// import mongoose from 'mongoose';

// export async function POST(req: Request) {
//   try {
//     const { sectionName } = await req.json();

//     if (!sectionName) {
//       return NextResponse.json(
//         { error: 'Section name required' },
//         { status: 400 },
//       );
//     }

//     await dbConnect();

//     const SectionModel =
//       mongoose.models[sectionName] ||
//       mongoose.model(
//         sectionName,
//         new mongoose.Schema({}, { strict: false }),
//         sectionName,
//       );

//     const records = await SectionModel.find({}).lean();

//     // ✅ Remove `_id` from each record
//     const cleanRecords = records.map(({ _id, __v, ...rest }) => rest);

//     return NextResponse.json({ data: cleanRecords }, { status: 200 });
//   } catch (err: any) {
//     console.error('Error fetching section attendance:', err.message);
//     return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { sectionName, subjectFilter, usernameFilter, fromDate, toDate } =
      await req.json();

    if (!sectionName) {
      return NextResponse.json(
        { error: 'Section name required' },
        { status: 400 },
      );
    }

    await dbConnect();

    const SectionModel =
      mongoose.models[sectionName] ||
      mongoose.model(
        sectionName,
        new mongoose.Schema({}, { strict: false }),
        sectionName,
      );

    let records = await SectionModel.find({}).lean();

    if (!records || records.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // ✅ Step 1: Apply filters directly on records

    // 1. Username filter
    if (usernameFilter) {
      records = records.filter(
        (r) => r.username?.toLowerCase() === usernameFilter.toLowerCase(),
      );
    }

    // 2. Date filter (based on meetingDate field)
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      records = records.filter((record) => {
        const recordDate = record.meetingDate
          ? new Date(record.meetingDate)
          : null;
        if (!recordDate) return false;
        return (!from || recordDate >= from) && (!to || recordDate <= to);
      });
    }

    // 3. Subject filter
    if (subjectFilter) {
      records = records.map((record) => {
        const filtered: any = { username: record.username };
        Object.entries(record).forEach(([key, val]) => {
          if (key.toLowerCase().includes(subjectFilter.toLowerCase())) {
            filtered[key] = val;
          }
        });
        return filtered;
      });
    }

    // ✅ Step 2: Remove unwanted fields (_id, __v, meetingDate)
    const cleanRecords = records.map(
      ({ _id, __v, meetingDate, ...rest }) => rest,
    );

    return NextResponse.json({ data: cleanRecords }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching section attendance:', err.message);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
