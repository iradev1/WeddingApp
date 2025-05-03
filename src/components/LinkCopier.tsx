import React, { useState } from 'react';

interface LinkCopierProps {
  link: string;
}

const LinkCopier: React.FC<LinkCopierProps> = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex rounded-md shadow-sm max-w-xl mx-auto">
      <input
        type="text"
        value={link}
        readOnly
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
      />
      <button
        onClick={copyToClipboard}
        className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm transition ${
          copied
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 focus:ring-orange-500 focus:border-orange-500'
        }`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default LinkCopier;
