'use client';

import { useState } from 'react';

const MessageScheduler = () => {
  const [numbers, setNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [sending, setSending] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledTime || !numbers || !message) {
      alert('Please fill in all fields.');
      return;
    }

    setSending(true);

    const res = await fetch('/api/send-whatsapp-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumbers: numbers.split(',').map((n) => n.trim()),
        message,
        time: scheduledTime,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert('Invalid response from server.');
      setSending(false);
      return;
    }

    if (res.ok) {
      alert('Message scheduled successfully!');
    } else {
      alert(`Error: ${data.error}`);
    }

    setSending(false);
  };

  return (
    <div className="bg-dark-2 text-white p-6 rounded-xl space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">Schedule WhatsApp Message</h2>

      <input
        className="w-full p-2 rounded text-black"
        placeholder="Enter comma-separated phone numbers"
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
      />

      <textarea
        className="w-full p-2 rounded text-black"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="datetime-local"
        className="w-full p-2 rounded text-black"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />

      <button
        onClick={handleSchedule}
        disabled={sending}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {sending ? 'Scheduling...' : 'Schedule Message'}
      </button>
    </div>
  );
};

export default MessageScheduler;
