import React, { useState } from 'react';

interface GuestListProps {
  guests: string[];
  onGuestsChange: (guests: string[]) => void;
}

const GuestList: React.FC<GuestListProps> = ({ guests, onGuestsChange }) => {
  const [newGuest, setNewGuest] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleAddGuest = () => {
    if (newGuest.trim()) {
      onGuestsChange([...guests, newGuest.trim()]);
      setNewGuest('');
    }
  };

  const handleRemoveGuest = (index: number) => {
    const updatedGuests = [...guests];
    updatedGuests.splice(index, 1);
    onGuestsChange(updatedGuests);
  };

  const handleBulkAdd = () => {
    if (bulkText.trim()) {
      const newGuests = bulkText
        .split('\n')
        .map(g => g.trim())
        .filter(g => g.length > 0);

      if (newGuests.length) {
        onGuestsChange([...guests, ...newGuests]);
        setBulkText('');
        setShowBulkInput(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={newGuest}
            onChange={(e) => setNewGuest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGuest()}
            placeholder="Enter guest name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddGuest}
            className="px-5 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        <div className="mt-2 text-right">
          <button
            onClick={() => setShowBulkInput(!showBulkInput)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showBulkInput ? 'Hide bulk input' : 'Add multiple guests'}
          </button>
        </div>

        {showBulkInput && (
          <div className="mt-4">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Enter one guest per line"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 text-right">
              <button
                onClick={handleBulkAdd}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
              >
                Add All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {guests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No guests added yet.
          </div>
        ) : (
          guests.map((guest, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
            >
              <span className="text-gray-800">{guest}</span>
              <button
                onClick={() => handleRemoveGuest(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
        Total guests: {guests.length}
      </div>
    </div>
  );
};

export default GuestList;
