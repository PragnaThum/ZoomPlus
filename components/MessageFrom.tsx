// components/MessageForm.tsx
'use client';

import { useState } from 'react';

const contacts = [
  { name: 'Alice', phone: '+919898989898' },
  { name: 'Bob', phone: '+918787878787' },
  { name: 'Charlie', phone: '+917676767676' },
];

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (phone: string) => {
    setSelected((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone],
    );
  };

  const sendMessage = async () => {
    if (!message || selected.length === 0)
      return alert('Fill message and select contacts');

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, recipients: selected }),
    });

    if (res.ok) alert('Messages sent successfully!');
    else alert('Something went wrong.');
  };

  return (
    <div className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message..."
        className="w-full border p-2"
      />
      <div>
        {contacts.map((c) => (
          <div key={c.phone}>
            <input
              type="checkbox"
              checked={selected.includes(c.phone)}
              onChange={() => toggleSelection(c.phone)}
            />
            <label className="ml-2">
              {c.name} ({c.phone})
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Send Message
      </button>
    </div>
  );
}
