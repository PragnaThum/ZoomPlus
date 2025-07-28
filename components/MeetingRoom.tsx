// 'use client';
// import { useEffect, useMemo, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import { useCall } from '@stream-io/video-react-sdk';

// import {
//   CallParticipantsList,
//   CallingState,
//   SpeakerLayout,
//   PaginatedGridLayout,
//   useCallStateHooks,
// } from '@stream-io/video-react-sdk';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Users, LayoutList, Bot } from 'lucide-react';
// import CallControls from './CustomCallControlls';
// import EndCallButton from './EndCallButton';
// import Loader from './Loader';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from './ui/dropdown-menu';
// import ClassroomLayout from './ClassroomLayout';
// import { cn } from '@/lib/utils';
// type CallLayoutType = 'grid' | 'classroom';

// const MeetingRoom = () => {
//   const searchParams = useSearchParams();

//   const meetingId = searchParams.get('id');
//   const isPersonalRoom = !!searchParams.get('personal');
//   const router = useRouter();
//   const [layout, setLayout] = useState<CallLayoutType>('grid');
//   const [chairsCount, setChairsCount] = useState<number>(2);
//   const [max_per_page, setMax_per_page] = useState<number>(2);
//   const [showParticipants, setShowParticipants] = useState(false);
//   const { useCallCallingState } = useCallStateHooks();
//   const [joinedAt, setJoinedAt] = useState<Date | null>(null);
//   const { user } = useUser();
//   const call = useCall();

//   const [chatbotEnabled, setChatbotEnabled] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);

//   const [chatInput, setChatInput] = useState('');
//   const [chatResponse, setChatResponse] = useState('');

//   const callingState = useCallCallingState();
//   if (callingState !== CallingState.JOINED) return <Loader />;

//   const handleLayoutChange = (newLayout: CallLayoutType) => {
//     if (newLayout === 'classroom') {
//       const input = prompt('Enter number of participants to show per page:');
//       const maxCount = input ? parseInt(input, 10) : NaN;

//       if (!isNaN(maxCount)) {
//         setMax_per_page(maxCount);
//         setLayout('classroom');
//       } else {
//         alert('Please enter a valid number.');
//       }
//     } else {
//       setLayout(newLayout);
//     }
//   };

//   const CallLayout = () => {
//     switch (layout) {
//       case 'grid':
//         return <PaginatedGridLayout />;
//       case 'classroom':
//         return <ClassroomLayout max_per_page={max_per_page} />;
//       default:
//         return <PaginatedGridLayout />;
//     }
//   };

//   return (
//     <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
//       <div className="relative flex size-full items-center justify-center">
//         <div className="flex size-full max-w-[1000px] items-center">
//           <CallLayout />
//         </div>
//         <div
//           className={
//             showParticipants ? 'block absolute right-0 top-0 h-full' : 'hidden'
//           }
//         >
//           <CallParticipantsList onClose={() => setShowParticipants(false)} />
//         </div>
//       </div>

//       <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
//         <CallControls onLeave={() => router.push(`/`)} />
//         <DropdownMenu>
//           <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
//             <LayoutList size={20} className="text-white" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
//             {(['grid', 'classroom'] as CallLayoutType[]).map((item, idx) => (
//               <div key={idx}>
//                 <DropdownMenuItem onClick={() => handleLayoutChange(item)}>
//                   {item.charAt(0).toUpperCase() + item.slice(1)}
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className="border-dark-1" />
//               </div>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <button onClick={() => setShowParticipants((prev) => !prev)}>
//           <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
//             <Users size={20} className="text-white" />
//           </div>
//         </button>

//         {!isPersonalRoom && <EndCallButton />}
//       </div>
//     </section>
//   );
// };

// export default MeetingRoom;

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  useCall,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';

import CallControls from './CustomCallControlls';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import ClassroomLayout from './ClassroomLayout';
import { Users, LayoutList, Bot } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right' | 'classroom';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('id');
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [maxPerPage, setMaxPerPage] = useState<number>(2);
  const [showParticipants, setShowParticipants] = useState(false);
  const [joinedAt, setJoinedAt] = useState<Date | null>(null);
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const { user } = useUser();
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    setJoinedAt(new Date());
  }, []);

  useEffect(() => {
    if (!call || !user) return;

    const username = user.emailAddresses[0].emailAddress.split('@')[0];
    const subjectFromQuery = call.state?.custom?.subject;
    if (!subjectFromQuery) return;

    const subject = subjectFromQuery.trim().toLowerCase();

    fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, subject, markPresent: false }),
    });

    const handleLeave = async () => {
      const leftAt = new Date();
      if (!joinedAt) return;

      const durationMs = leftAt.getTime() - joinedAt.getTime();
      const durationMinutes = durationMs / (1000 * 60);

      await fetch('/api/session-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, subject, joinedAt, leftAt }),
      });

      if (durationMinutes >= 30) {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            subject,
            markPresent: true,
            meetingDate: new Date().toISOString(),
          }),
        });
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') handleLeave();
    });

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [call, user, joinedAt]);

  useEffect(() => {
    if (!call) return;
    const isChatbotAllowed = call.state?.custom?.allowChatbot;
    setChatbotEnabled(isChatbotAllowed === true);
  }, [call?.state?.custom?.allowChatbot]);

  const handleLayoutChange = (newLayout: CallLayoutType) => {
    if (newLayout === 'classroom') {
      const input = prompt('Enter number of participants to show per page:');
      const count = input ? parseInt(input, 10) : NaN;
      if (!isNaN(count)) {
        setMaxPerPage(count);
        setLayout('classroom');
      } else {
        alert('Please enter a valid number.');
      }
    } else {
      setLayout(newLayout);
    }
  };

  const memoizedLayout = useMemo(() => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="right" />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      case 'classroom':
        return <ClassroomLayout max_per_page={maxPerPage} />;
      default:
        return <PaginatedGridLayout />;
    }
  }, [layout, maxPerPage]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    setChatResponse('⏳ Thinking...');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chatInput }),
      });
      const data = await res.json();
      setChatResponse(data.message || '⚠️ No reply from Gemini.');
    } catch (err) {
      console.error(err);
      setChatResponse('❌ Failed to fetch response.');
    }
  };

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          {memoizedLayout}
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {(
              [
                'grid',
                'speaker-left',
                'speaker-right',
                'classroom',
              ] as CallLayoutType[]
            ).map((item, idx) => (
              <div key={idx}>
                <DropdownMenuItem onClick={() => handleLayoutChange(item)}>
                  {item.charAt(0).toUpperCase() +
                    item.slice(1).replace('-', ' ')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {chatbotEnabled && (
          <button
            onClick={() => setShowChatbot(true)}
            className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
          >
            <Bot size={20} className="text-white" />
          </button>
        )}

        {!isPersonalRoom && <EndCallButton />}
      </div>

      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[450px] rounded-xl bg-white shadow-lg text-black p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">AI Chat Assistant</h2>
            <button onClick={() => setShowChatbot(false)} className="text-sm">
              ❌
            </button>
          </div>

          <div className="h-[250px] overflow-y-auto bg-gray-100 p-2 rounded">
            <p className="text-sm whitespace-pre-wrap">
              {chatResponse || 'Ask something...'}
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask AI anything..."
              className="flex-1 border px-2 py-1 text-sm rounded"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MeetingRoom;
