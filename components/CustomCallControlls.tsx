import { useState } from 'react';
import {
  CancelCallButton,
  SpeakingWhileMutedNotification,
  ToggleVideoPublishingButton,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const CallControls = ({ onLeave }: { onLeave: () => void }) => {
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [showUnmuteConfirm, setShowUnmuteConfirm] = useState(false);

  const call = useCall();
  const { useMicrophoneState } = useCallStateHooks();
  const { isMute } = useMicrophoneState(); // This is correct and reactive

  const handleMicToggle = () => {
    if (!call) return;

    // If inactive and currently muted, show confirm popup
    if (status === 'inactive' && isMute) {
      setShowUnmuteConfirm(true);
    } else {
      call.microphone.toggle();
    }
  };

  return (
    <div className="str-video__call-controls flex gap-3">
      <SpeakingWhileMutedNotification>
        <button
          onClick={handleMicToggle}
          className="rounded bg-gray-700 px-2 py-1"
        >
          {isMute ? '🔇 Mute' : '🎤 Unmute'}
        </button>
      </SpeakingWhileMutedNotification>

      <ToggleVideoPublishingButton />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="rounded bg-gray-700 px-2 py-1">
            Status: {status}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setStatus('active')}>
            ✅ Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatus('inactive')}>
            🚫 Inactive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CancelCallButton onLeave={onLeave} />

      {showUnmuteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-dark-1 p-6 rounded-xl text-white text-center">
            <h2 className="text-xl font-semibold mb-4">Unmute Confirmation</h2>
            <p className="mb-6">Do you really want to unmute while inactive?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  call?.microphone.toggle(); // just toggle it
                  setShowUnmuteConfirm(false);
                }}
                className="px-4 py-2 bg-green-600 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowUnmuteConfirm(false)}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallControls;
