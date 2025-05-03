import React, { useEffect, useState } from 'react';

interface PreviewTemplateProps {
  template: string;
  data: {
    groom: string;
    bride: string;
    date: string;
    location: string;
  };
}

const PreviewTemplate: React.FC<PreviewTemplateProps> = ({ template, data }) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, you would fetch a real preview from the server
    // or use template components
    setTimeout(() => {
      const html = `
        <div class="text-center p-4">
          <h2 class="text-xl font-semibold">${data.groom} & ${data.bride}</h2>
          <p class="mt-2">${data.date}</p>
          <p class="mt-1">${data.location}</p>
          <p class="mt-3 text-sm italic">Template: ${template}</p>
        </div>
      `;
      setPreviewHtml(html);
      setLoading(false);
    }, 500);
  }, [template, data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-100 rounded">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="border border-gray-200 rounded overflow-hidden"
      dangerouslySetInnerHTML={{ __html: previewHtml }}
    />
  );
};

export default PreviewTemplate;