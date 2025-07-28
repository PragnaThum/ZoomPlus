// /* eslint-disable camelcase */
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// import HomeCard from './HomeCard';
// import MeetingModal from './MeetingModal';
// import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
// import { useUser } from '@clerk/nextjs';
// import Loader from './Loader';
// import { Textarea } from './ui/textarea';
// import ReactDatePicker from 'react-datepicker';
// import { useToast } from './ui/use-toast';
// import { Input } from './ui/input';

// const initialValues = {
//   dateTime: new Date(),
//   description: '',
//   link: '',
// };

// const MeetingTypeList = () => {
//   const router = useRouter();
//   const [meetingState, setMeetingState] = useState<
//     'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
//   >(undefined);
//   const [values, setValues] = useState(initialValues);
//   const [callDetail, setCallDetail] = useState<Call>();
//   const client = useStreamVideoClient();
//   const { user } = useUser();
//   const { toast } = useToast();

//   const createMeeting = async () => {
//     if (!client || !user) return;
//     try {
//       if (!values.dateTime) {
//         toast({ title: 'Please select a date and time' });
//         return;
//       }
//       const id = crypto.randomUUID();
//       const call = client.call('default', id);
//       if (!call) throw new Error('Failed to create meeting');
//       const startsAt =
//         values.dateTime.toISOString() || new Date(Date.now()).toISOString();
//       const description = values.description || 'Instant Meeting';
//       await call.getOrCreate({
//         data: {
//           starts_at: startsAt,
//           custom: {
//             description,
//           },
//         },
//       });
//       setCallDetail(call);
//       if (!values.description) {
//         router.push(`/meeting/${call.id}`);
//       }
//       toast({
//         title: 'Meeting Created',
//       });
//     } catch (error) {
//       console.error(error);
//       toast({ title: 'Failed to create Meeting' });
//     }
//   };

//   if (!client || !user) return <Loader />;

//   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

//   return (
//     <div className="flex justify-center items-center  ">
//       <section className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 text-white ">
//         <HomeCard
//           img="/icons/add-meeting.svg"
//           title="New Meeting"
//           description="Start an instant meeting"
//           handleClick={() => setMeetingState('isInstantMeeting')}
//         />
//         <HomeCard
//           img="/icons/join-meeting.svg"
//           title="Join Meeting"
//           description="via invitation link"
//           className="bg-blue-1"
//           handleClick={() => setMeetingState('isJoiningMeeting')}
//         />
//         <HomeCard
//           img="/icons/schedule.svg"
//           title="Schedule Meeting"
//           description="Plan your meeting"
//           className="bg-purple-1"
//           handleClick={() => setMeetingState('isScheduleMeeting')}
//         />
//         <HomeCard
//           img="/icons/recordings.svg"
//           title="View Recordings"
//           description="Meeting Recordings"
//           className="bg-yellow-1"
//           handleClick={() => router.push('/recordings')}
//         />

//         {!callDetail ? (
//           <MeetingModal
//             isOpen={meetingState === 'isScheduleMeeting'}
//             onClose={() => setMeetingState(undefined)}
//             title="Create Meeting"
//             handleClick={createMeeting}
//             showWhatsAppSection={true}
//             scheduledTime={values.dateTime.toISOString()}
//           >
//             <div className="flex flex-col gap-2.5">
//               <label className="text-base font-normal leading-[22.4px] text-sky-2">
//                 Add a description
//               </label>
//               <Textarea
//                 className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
//                 onChange={(e) =>
//                   setValues({ ...values, description: e.target.value })
//                 }
//               />
//             </div>
//             <div className="flex w-full flex-col gap-2.5">
//               <label className="text-base font-normal leading-[22.4px] text-sky-2">
//                 Select Date and Time
//               </label>
//               <ReactDatePicker
//                 selected={values.dateTime}
//                 onChange={(date) => setValues({ ...values, dateTime: date! })}
//                 showTimeSelect
//                 timeFormat="HH:mm"
//                 timeIntervals={15}
//                 timeCaption="time"
//                 dateFormat="MMMM d, yyyy h:mm aa"
//                 className="w-full rounded bg-dark-3 p-2 focus:outline-none"
//               />
//             </div>
//           </MeetingModal>
//         ) : (
//           <MeetingModal
//             isOpen={meetingState === 'isScheduleMeeting'}
//             onClose={() => setMeetingState(undefined)}
//             title="Meeting Created"
//             handleClick={() => {
//               navigator.clipboard.writeText(meetingLink);
//               toast({ title: 'Link Copied' });
//             }}
//             image={'/icons/checked.svg'}
//             buttonIcon="/icons/copy.svg"
//             className="text-center"
//             buttonText="Copy Meeting Link"
//           />
//         )}

//         <MeetingModal
//           isOpen={meetingState === 'isJoiningMeeting'}
//           onClose={() => setMeetingState(undefined)}
//           title="Type the link here"
//           className="text-center"
//           buttonText="Join Meeting"
//           handleClick={() => router.push(values.link)}
//         >
//           <Input
//             placeholder="Meeting link"
//             onChange={(e) => setValues({ ...values, link: e.target.value })}
//             className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
//           />
//         </MeetingModal>

//         <MeetingModal
//           isOpen={meetingState === 'isInstantMeeting'}
//           onClose={() => setMeetingState(undefined)}
//           title="Start an Instant Meeting"
//           className="text-center"
//           buttonText="Start Meeting"
//           handleClick={createMeeting}
//         />
//       </section>
//     </div>
//   );
// };

// export default MeetingTypeList;
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
  subject: '',
  markAttendance: false,
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);

  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const [allowChatbot, setAllowChatbot] = useState(false);

  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');

      const startsAt = values.dateTime.toISOString();
      const description = values.description || 'Instant Meeting';
      const subject = values.markAttendance ? values.subject.trim() : undefined;

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
            subject,
            allowChatbot,
          },
        },
      });

      setCallDetail(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({ title: 'Meeting Created' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 text-white">
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an instant meeting"
          handleClick={() => setMeetingState('isInstantMeeting')}
        />
        <HomeCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          className="bg-blue-1"
          handleClick={() => setMeetingState('isJoiningMeeting')}
        />
        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan your meeting"
          className="bg-purple-1"
          handleClick={() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Meeting Recordings"
          className="bg-yellow-1"
          handleClick={() => router.push('/recordings')}
        />
        {/* <HomeCard
          img="/icons/attendance.svg"
          title="View Attendance"
          description="Section-wise records"
          className="bg-yellow-1"
          handleClick={() => router.push('/attendance')}
        /> */}

        {/* Schedule Modal */}
        {!callDetail ? (
          <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Create Meeting"
            handleClick={createMeeting}
            showWhatsAppSection={true}
            scheduledTime={values.dateTime.toISOString()}
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-normal text-sky-2">
                Add a description
              </label>
              <Textarea
                className="border-none bg-dark-3 focus-visible:ring-0"
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base font-normal text-sky-2">
                Select Date and Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </MeetingModal>
        ) : (
          <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Meeting Created"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({ title: 'Link Copied' });
            }}
            image="/icons/checked.svg"
            buttonIcon="/icons/copy.svg"
            className="text-center"
            buttonText="Copy Meeting Link"
          />
        )}

        {/* Join Meeting Modal */}
        <MeetingModal
          isOpen={meetingState === 'isJoiningMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Type the link here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={() => router.push(values.link)}
        >
          <Input
            placeholder="Meeting link"
            onChange={(e) => setValues({ ...values, link: e.target.value })}
            className="border-none bg-dark-3 focus-visible:ring-0"
          />
        </MeetingModal>

        {/* Instant Meeting Modal */}
        <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        >
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="chatbot"
              checked={allowChatbot}
              onChange={(e) => setAllowChatbot(e.target.checked)}
            />
            <label htmlFor="chatbot" className="text-sm">
              Allow AI Chatbot for participants
            </label>
          </div>

          <div className="flex flex-col items-center gap-4 mt-4">
            <label className="font-semibold text-sm">
              Do you want to mark attendance for this meeting?
            </label>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="yes"
                  checked={values.markAttendance}
                  onChange={() =>
                    setValues({ ...values, markAttendance: true })
                  }
                />
                <label htmlFor="yes">Yes</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="no"
                  checked={!values.markAttendance}
                  onChange={() =>
                    setValues({ ...values, markAttendance: false })
                  }
                />
                <label htmlFor="no">No</label>
              </div>
            </div>

            {values.markAttendance && (
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Enter subject name:
                </label>
                <input
                  id="subject"
                  type="text"
                  className="border px-2 py-1"
                  placeholder="Subject Name"
                  value={values.subject}
                  onChange={(e) =>
                    setValues({ ...values, subject: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </MeetingModal>
      </div>
    </section>
  );
};

export default MeetingTypeList;
