'use client';
import { ReactNode, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Image from 'next/image';
import { Input } from './ui/input';
import { Plus, X } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
  showWhatsAppSection?: boolean;
  scheduledTime?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  instantMeeting,
  image,
  buttonClassName,
  buttonIcon,
  showWhatsAppSection,
  scheduledTime,
}: MeetingModalProps) => {
  const [phone, setPhone] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('');

  const addPhone = () => {
    const formattedPhone = phone.trim().replace(/\s+/g, ''); // remove spaces
    if (formattedPhone && !phones.includes(formattedPhone)) {
      console.log('Adding phone:', formattedPhone);
      setPhones([...phones, formattedPhone]);
      setPhone('');
    }
  };

  const removePhone = (index: number) => {
    const updated = [...phones];
    updated.splice(index, 1);
    setPhones(updated);
  };

  // const handleNotify = async () => {
  //   console.log("Phones state BEFORE sending:", phones);

  //   if (phones.length === 0) {
  //     alert("Please add at least one phone number.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("/api/whatsapp/notify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phoneNumbers: phones,
  //         message: `Reminder: Your meeting starts in ${reminderTime} minutes.`,
  //       }),
  //     });

  //     console.log("Sending to backend:", {
  //       phoneNumbers: phones,
  //       message: `Reminder: Your meeting starts in ${reminderTime} minutes.`,
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       alert("Reminders sent successfully!");
  //       setPhones([]); // Clear list after sending
  //       setReminderTime("");
  //     } else {
  //       alert("Failed to send reminders.");
  //     }
  //   } catch (error) {
  //     console.error("Notification error:", error);
  //     alert("Something went wrong while sending WhatsApp reminders.");
  //   }
  // };

  const handleNotify = async () => {
    console.log('Phones state BEFORE sending:', phones);

    if (phones.length === 0) {
      alert('Please add at least one phone number.');
      return;
    }

    // Ensure scheduledTime is defined and valid
    if (!scheduledTime) {
      alert('Scheduled time is not defined.');
      return;
    }

    const currentTime = new Date().getTime(); // Current time in milliseconds

    // Ensure scheduledTime is a valid string or date
    const scheduledMeetingTime = new Date(scheduledTime).getTime();
    if (isNaN(scheduledMeetingTime)) {
      alert('Invalid scheduled time.');
      return;
    }

    const reminderInMinutes = parseInt(reminderTime, 10); // Convert reminder time to number (minutes)
    if (isNaN(reminderInMinutes)) {
      alert('Invalid reminder time.');
      return;
    }

    const reminderInMilliseconds = reminderInMinutes * 60 * 1000; // Convert minutes to milliseconds

    // Calculate the time to trigger the reminder (scheduled time - reminder time)
    const reminderTimeInMilliseconds =
      scheduledMeetingTime - reminderInMilliseconds;

    // Check if the reminder time is valid (it should be in the future)
    if (reminderTimeInMilliseconds <= currentTime) {
      alert('The reminder time is already passed. Please select a valid time.');
      return;
    }

    // Set the timeout to send the notification at the correct time
    const timeoutDuration = reminderTimeInMilliseconds - currentTime; // Time until reminder should be sent

    console.log(`Reminder will be sent in ${timeoutDuration / 1000} seconds.`);

    // Use setTimeout to trigger the reminder after the calculated time
    setTimeout(async () => {
      try {
        const res = await fetch('/api/whatsapp/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumbers: phones,
            message: `Reminder: Your meeting starts in ${reminderTime} minutes.`,
          }),
        });

        console.log('Sending to backend:', {
          phoneNumbers: phones,
          message: `Reminder: Your meeting starts in ${reminderTime} minutes.`,
        });

        const data = await res.json();
        if (data.success) {
          alert('Reminders sent successfully!');
          setPhones([]); // Clear list after sending
          setReminderTime('');
        } else {
          alert('Failed to send reminders.');
        }
      } catch (error) {
        console.error('Notification error:', error);
        alert('Something went wrong while sending WhatsApp reminders.');
      }
    }, timeoutDuration); // Delay the reminder sending by timeoutDuration milliseconds
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>
            {title}
          </h1>
          {children}

          {/* Notify on WhatsApp Section */}
          {showWhatsAppSection && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Notify on WhatsApp</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-black"
                />
                <Button variant="secondary" onClick={addPhone}>
                  <Plus size={18} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {phones.map((num, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full bg-blue-1 px-3 py-1 text-sm"
                  >
                    {num}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removePhone(i)}
                    />
                  </div>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Minutes before meeting"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="text-black"
              />
              <Button onClick={handleNotify} className="bg-green-600">
                Send WhatsApp Reminder
              </Button>
            </div>
          )}

          <Button
            className={cn(
              'bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0',
              buttonClassName,
            )}
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{' '}
            &nbsp;
            {buttonText || 'Schedule Meeting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
