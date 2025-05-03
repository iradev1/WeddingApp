import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Crown } from 'lucide-react';
import PaymentGateway from './PaymentGateway';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  isPremium: boolean;
  price: number;
}

interface TemplateSelectorProps {
  onSelect: (template: string, orderId?: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Fetch templates from the server
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        
        if (data.success && Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          setError('Gagal memuat data template');
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Terjadi kesalahan saat memuat template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const openPreview = async (templateId: string) => {
    setLoadingTemplateId(templateId);
    try {
      const res = await fetch(`/api/template/${templateId}`);
      const data = await res.json();
      if (data.success && data.template) {
        const newWindow = window.open('', '_blank');
        newWindow?.document.write(data.template);
        newWindow?.document.close();
      } else {
        alert('Gagal memuat preview template.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memuat preview.');
    } finally {
      setLoadingTemplateId(null);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    if (template.isPremium) {
      setSelectedTemplate(template);
      setShowPayment(true);
    } else {
      onSelect(template.id);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.id, orderId);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md h-80">
                <div className="h-52 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="flex justify-between gap-4">
                    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show payment component if needed
  if (showPayment && selectedTemplate) {
    return (
      <PaymentGateway
        templateId={selectedTemplate.id}
        templateName={selectedTemplate.name}
        price={selectedTemplate.price}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => {
          setShowPayment(false);
          setSelectedTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Pilih Template Undangan
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col overflow-hidden relative"
          >
            {template.isPremium && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            )}
            
            <img
              src={template.thumbnail}
              alt={`Template ${template.name}`}
              className="w-full h-52 object-cover"
            />
            
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 text-center mb-2">
                  {template.name}
                </h3>
                
                {template.isPremium && (
                  <p className="text-center text-gray-600 mb-4">
                    <span className="font-medium text-green-600">
                      Rp {new Intl.NumberFormat('id-ID').format(template.price)}
                    </span>
                  </p>
                )}
              </div>
              
              <div className="flex justify-between mt-auto gap-4">
                <button
                  onClick={() => openPreview(template.id)}
                  disabled={loadingTemplateId === template.id}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition disabled:opacity-50 w-1/2"
                >
                  <Eye className="w-4 h-4" />
                  {loadingTemplateId === template.id ? 'Loading...' : 'Preview'}
                </button>
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 ${
                    template.isPremium ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                  } text-white rounded-lg font-medium transition w-1/2`}
                >
                  {template.isPremium ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Beli
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Pilih
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;