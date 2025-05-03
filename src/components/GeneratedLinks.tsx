import React, { useState } from 'react';
import { Check, Copy, Download, Mail, ChevronLeft, RefreshCw } from 'lucide-react';

interface GeneratedLinksProps {
  links: Array<{ guest: string; link: string }>;
  onStartOver: () => void;
  templateId: string;
  emailSent?: boolean;
  emailAddress?: string;
}

const GeneratedLinks: React.FC<GeneratedLinksProps> = ({
  links,
  onStartOver,
  templateId,
  emailSent,
  emailAddress
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCopiedAll, setShowCopiedAll] = useState(false);

  // Filter links based on search term
  const filteredLinks = links.filter(item => 
    item.guest.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Copy link to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Copy all links to clipboard
  const copyAllToClipboard = () => {
    const allLinks = links.map(item => `${item.guest}: ${item.link}`).join('\n\n');
    navigator.clipboard.writeText(allLinks).then(() => {
      setShowCopiedAll(true);
      setTimeout(() => setShowCopiedAll(false), 2000);
    });
  };
  
  // Download all links as CSV
  const downloadCSV = () => {
    let csvContent = "Nama Tamu,Link Undangan\n";
    
    links.forEach(item => {
      csvContent += `"${item.guest}","${item.link}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'undangan_link.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Download all links as plain text
  const downloadTXT = () => {
    let textContent = "Link Undangan Pernikahan\n\n";
    
    links.forEach(item => {
      textContent += `${item.guest}: ${item.link}\n\n`;
    });
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'undangan_link.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with success message */}
      <div className="bg-green-100 p-4 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-800">Undangan Berhasil Dibuat!</h2>
            <p className="text-sm text-green-700 mt-1">
              Semua tautan undangan telah berhasil dibuat dan siap untuk dibagikan
            </p>
          </div>
          <div className="flex-shrink-0 bg-green-500 rounded-full p-2">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Email notification if email was sent */}
      {emailSent && emailAddress && (
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <p className="text-blue-800 font-medium">
                Link undangan telah dikirim ke email Anda
              </p>
              <p className="text-sm text-blue-700">
                Semua tautan juga telah dikirimkan ke: <span className="font-semibold">{emailAddress}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and action buttons */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-64 p-2 pr-8 border rounded-md"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyAllToClipboard}
              className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
            >
              {showCopiedAll ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Salin Semua
                </>
              )}
            </button>
            
            <button
              onClick={downloadCSV}
              className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Download CSV
            </button>
            
            <button
              onClick={downloadTXT}
              className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Download TXT
            </button>
          </div>
        </div>
      </div>
      
      {/* Links list */}
      <div className="overflow-y-auto max-h-96">
        {filteredLinks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredLinks.map((item, index) => (
              <li key={index} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-medium">{item.guest}</h3>
                    <p className="text-sm text-gray-500 break-all">{item.link}</p>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(item.link, index)}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm mt-2 sm:mt-0 ${
                      copiedIndex === index 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Salin Link
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">Tidak ada tamu yang cocok dengan pencarian "{searchTerm}"</p>
          </div>
        )}
      </div>
      
      {/* Footer with template ID and actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-500">
            Template ID: <span className="font-mono">{templateId}</span>
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={onStartOver}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Buat Undangan Baru
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Segarkan Halaman
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedLinks;