'use client';

import { useState } from 'react';
import { useCallStateHooks, ParticipantView } from '@stream-io/video-react-sdk';

const ClassroomLayout = ({ max_per_page }: { max_per_page: number }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(participants.length / max_per_page);
  const startIndex = page * max_per_page;
  const endIndex = Math.min(startIndex + max_per_page, participants.length);

  const participantsToRender = participants.slice(startIndex, endIndex);
  const count = participantsToRender.length;

  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  const tileSize =
    count <= 4
      ? 'w-56 h-56'
      : count <= 9
        ? 'w-48 h-48'
        : count <= 16
          ? 'w-40 h-40'
          : count <= 25
            ? 'w-32 h-32'
            : 'w-28 h-28';

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {participantsToRender.map((participant, idx) => (
            <div
              key={startIndex + idx}
              className={`${tileSize} rounded-xl overflow-hidden border-2 border-white bg-black flex items-center justify-center`}
            >
              <ParticipantView
                participant={participant}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 z-50">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="bg-white text-black p-2 rounded-full disabled:opacity-50"
          >
            ◀
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="bg-white text-black p-2 rounded-full disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassroomLayout;
