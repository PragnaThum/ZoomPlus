'use client';

import { useState } from 'react';
import {
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';
import CallControls from './CustomCallControlls';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import ClassroomLayout from './ClassroomLayout';

type CallLayoutType = 'grid' | 'classroom';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('grid');
  const [chairsCount, setChairsCount] = useState<number>(2);
  const [max_per_page, setMax_per_page] = useState<number>(2);
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) return <Loader />;

  const handleLayoutChange = (newLayout: CallLayoutType) => {
    if (newLayout === 'classroom') {
      const input = prompt('Enter number of participants to show per page:');
      const maxCount = input ? parseInt(input, 10) : NaN;

      if (!isNaN(maxCount)) {
        setMax_per_page(maxCount);
        setLayout('classroom');
      } else {
        alert('Please enter a valid number.');
      }
    } else {
      setLayout(newLayout);
    }
  };

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'classroom':
        return <ClassroomLayout max_per_page={max_per_page} />;
      default:
        return <PaginatedGridLayout />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={
            showParticipants ? 'block absolute right-0 top-0 h-full' : 'hidden'
          }
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
            {(['grid', 'classroom'] as CallLayoutType[]).map((item, idx) => (
              <div key={idx}>
                <DropdownMenuItem onClick={() => handleLayoutChange(item)}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
