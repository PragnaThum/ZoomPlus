//!without adding filters fetching
// 'use client';

// import { useState } from 'react';

// export default function AttendancePage() {
//   const [section, setSection] = useState('');
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchAttendance = async () => {
//     if (!section) return;

//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch('/api/section-attendance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sectionName: section }),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || 'Failed to fetch');

//       setData(result.data);
//     } catch (err: any) {
//       setError(err.message);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-2xl mb-4">📋 View Section Attendance</h1>

//       <select
//         className="bg-dark-3 text-white p-2 rounded mb-4"
//         value={section}
//         onChange={(e) => setSection(e.target.value)}
//       >
//         <option value="">Select Section</option>
//         <option value="cse-a">CSE-A</option>
//         <option value="cse-b">CSE-B</option>
//       </select>

//       <button
//         onClick={fetchAttendance}
//         className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Fetch Attendance
//       </button>

//       {loading && <p className="mt-4">⏳ Loading...</p>}
//       {error && <p className="mt-4 text-red-500">❌ {error}</p>}

//       {data.length > 0 && (
//         <div className="overflow-auto mt-6">
//           <table className="w-full border border-gray-600 text-left">
//             <thead>
//               <tr>
//                 {Object.keys(data[0]).map((key) => (
//                   <th key={key} className="border border-gray-600 px-4 py-2">
//                     {key}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, idx) => (
//                 <tr key={idx}>
//                   {Object.values(row).map((val, i) => (
//                     <td key={i} className="border border-gray-600 px-4 py-2">
//                       {val as string}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

//!add filters and fetch

'use client';

import { useState } from 'react';
// import { Calendar } from '@/components/ui/calendar';

import { format } from 'date-fns';
import { Filter } from 'lucide-react';

export default function AttendancePage() {
  const [section, setSection] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    if (!section) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/section-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: section,
          subjectFilter,
          usernameFilter,
          fromDate,
          toDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to fetch');

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">📋 View Section Attendance</h1>

      <div className="flex items-center mb-4 gap-4">
        <select
          className="bg-dark-3 text-white p-2 rounded"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="cse-a">CSE-A</option>
          <option value="cse-b">CSE-B</option>
        </select>

        <button
          onClick={fetchAttendance}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Attendance
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2"
          title="Toggle filters"
        >
          <Filter size={18} />
          {showFilters ? 'Hide Filters' : 'Filter'}
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Subject name"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-dark-3 text-white p-2 rounded"
          />

          <input
            placeholder="Username"
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            className="bg-dark-3 text-white p-2 rounded"
          />

          <div className="flex flex-col">
            <label className="text-sm mb-1">From Date</label>
            <input
              type="date"
              className="bg-dark-3 text-white p-2 rounded"
              onChange={(e) => setFromDate(new Date(e.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">To Date</label>
            <input
              type="date"
              className="bg-dark-3 text-white p-2 rounded"
              onChange={(e) => setToDate(new Date(e.target.value))}
            />
          </div>
        </div>
      )}

      {loading && <p className="mt-4">⏳ Loading...</p>}
      {error && <p className="mt-4 text-red-500">❌ {error}</p>}

      {data.length > 0 && (
        <div className="overflow-auto mt-6">
          <table className="w-full border border-gray-600 text-left">
            <thead>
              <tr>
                {Object.keys(data[0])
                  .filter((key) => key !== '_id' && key !== 'meetingDate')
                  .map((key) => (
                    <th key={key} className="border border-gray-600 px-4 py-2">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.entries(row)
                    .filter(([key]) => key !== '_id' && key !== 'meetingDate')
                    .map(([key, val], i) => (
                      <td key={i} className="border border-gray-600 px-4 py-2">
                        {val as string}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
