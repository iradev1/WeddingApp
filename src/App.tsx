import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import TemplateSelector from './components/TemplateSelector';
import InvitationForm from './components/InvitationForm';
import UploadWidget from './components/UploadWidget';
import GeneratedLinks from './components/GeneratedLinks';
import PaymentResult from './components/PaymentResult';
import InspectWarningModal from './InspectWarningModal';

// Interface for form data
interface FormData {
  groom: string;
  bride: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  date: string;
  akadDate: string;
  receptionDate: string;
  akadTime: string;
  receptionTime: string;
  akadLocation: string;
  receptionLocation: string;
  address: string;
  location: string;
  mapLink: string;
  guests: string[];
  facebookLink: string;
  instagramLink: string;
  facebookLink1: string;
  instagramLink1: string;
  userEmail?: string; // Make optional here to match InvitationForm
}

// Component for step navigation
const StepNavigation = ({ step }: { step: number }) => {
  return (
    <div className="steps">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Select Template</div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Fill Form</div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Upload Media</div>
      <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Get Links</div>
    </div>
  );
};

// Main content component
const MainContent = () => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateIsPremium, setTemplateIsPremium] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [photoLink, setPhotoLink] = useState<string>('');
  const [musicLink, setMusicLink] = useState<string>('');
  const [bridePhoto, setBridePhoto] = useState<string>('');
  const [groomPhoto, setGroomPhoto] = useState<string>('');
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    groom: '',
    bride: '',
    groomFather: '',
    groomMother: '',
    brideFather: '',
    brideMother: '',
    date: '',
    akadDate: '',
    receptionDate: '',
    akadTime: '',
    receptionTime: '',
    akadLocation: '',
    receptionLocation: '',
    address: '',
    location: '',
    mapLink: '',
    guests: [''],
    facebookLink: '',
    instagramLink: '',
    facebookLink1: '',
    instagramLink1: '',
    userEmail: '' // Initialize as empty string
  });
  const [generatedLinks, setGeneratedLinks] = useState<Array<{ guest: string, link: string }>>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const location = useLocation();

  // Handle location state (used when redirecting from payment result)
  useEffect(() => {
    if (location.state) {
      const { orderId } = location.state as { orderId?: string };
      if (orderId) {
        setOrderId(orderId);
      }
    }
  }, [location]);

  // Handle Cloudinary script loading
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle file uploads
  const handlePhotoUpload = (url: string) => {
    setPhotoLink(url);
  };

  const handleMusicUpload = (url: string) => {
    setMusicLink(url);
  };

  const handleBridePhotoUpload = (url: string) => {
    setBridePhoto(url);
  };

  const handleGroomPhotoUpload = (url: string) => {
    setGroomPhoto(url);
  };

  const handleGalleryUpload = (url: string) => {
    setGalleryPhotos(prev => [...prev, url]);
  };

  // Template selection (with optional orderId for premium templates)
  const handleTemplateSelect = async (template: string, paymentOrderId?: string) => {
    setSelectedTemplate(template);

    try {
      const response = await fetch(`/api/template/${template}/info`);
      if (!response.ok) {
        throw new Error(`Server mengembalikan status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.template) {
        alert('Template tidak ditemukan atau gagal dimuat.');
        return;
      }

      const { isPremium, price } = data.template;
      setTemplateIsPremium(isPremium);

      if (isPremium) {
        if (paymentOrderId) {
          // Verify the payment status before proceeding
          const paymentStatusResponse = await fetch(`/api/payment-status/${paymentOrderId}`);
          const paymentStatus = await paymentStatusResponse.json();
          
          if (paymentStatus.success && paymentStatus.data.status === 'success') {
            setOrderId(paymentOrderId);
            setStep(2);
          } else {
            alert('Pembayaran belum berhasil. Silakan selesaikan pembayaran terlebih dahulu.');
            // Initiate payment process
            await initiatePayment(template, price);
          }
        } else {
          // No orderId, start payment process
          if (price) {
            await initiatePayment(template, price);
          } else {
            alert('Harga template tidak valid. Silakan coba lagi.');
          }
        }
      } else {
        // For non-premium templates, proceed normally
        setStep(2);
      }
    } catch (err) {
      console.error('Terjadi error saat memilih template:', err);
      alert('Terjadi kesalahan saat memproses template. Silakan coba lagi nanti.');
    }
  };

  const initiatePayment = async (templateId: string, price: number) => {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          price
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.token) {
        // Store orderId for later use
        setOrderId(result.orderId);
        
        // Redirect to Midtrans payment page
        window.location.href = result.redirectUrl;
      } else {
        alert('Gagal membuat pembayaran: ' + (result.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran.');
    }
  };

  // Form data handling - Updated to handle optional userEmail
  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setStep(3);
  };

  // Upload completion handling
  const handleUploadComplete = () => {
    setIsUploading(false);
    setStep(4);
    generateLinks();
  };

  // Generate invitation links
  const generateLinks = async () => {
    // Display loading status
    setIsUploading(true);
    
    // Check if the template is premium and payment is required
    if (templateIsPremium) {
      if (!orderId) {
        alert('Template ini premium. Harap selesaikan pembayaran terlebih dahulu.');
        setIsUploading(false);
        return;
      }
      
      // Verify payment status before generating links
      try {
        console.log('Memeriksa status pembayaran untuk order:', orderId);
        const paymentStatusResponse = await fetch(`/api/payment-status/${orderId}`);
        
        if (!paymentStatusResponse.ok) {
          throw new Error(`Gagal memeriksa status pembayaran: ${paymentStatusResponse.status}`);
        }
        
        const paymentStatus = await paymentStatusResponse.json();
        console.log('Respon status pembayaran:', paymentStatus);
        
        if (!paymentStatus.success || paymentStatus.data.status !== 'success') {
          alert('Pembayaran belum berhasil diverifikasi. Silakan selesaikan pembayaran terlebih dahulu.');
          setIsUploading(false);
          return;
        }
      } catch (error) {
        console.error('Error verifikasi pembayaran:', error);
        alert('Gagal memverifikasi status pembayaran: ' + (error as Error).message);
        setIsUploading(false);
        return;
      }
    }

    // Check if the guest list is not empty
    if (!formData.guests || formData.guests.filter(guest => guest.trim() !== '').length === 0) {
      alert('Silakan tambahkan setidaknya satu nama tamu');
      setIsUploading(false);
      return;
    }

    try {
      // Prepare request payload
      const payload = {
        templateId: selectedTemplate,
        orderId: orderId,
        formData: formData,
        mediaData: {
          mainPhoto: photoLink,
          backgroundMusic: musicLink,
          bridePhoto: bridePhoto,
          groomPhoto: groomPhoto,
          galleryPhotos: galleryPhotos,
        },
        userEmail: formData.userEmail || null // Include user email if provided
      };
      
      console.log('Mengirim request generate dengan payload:', JSON.stringify(payload));
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Server merespon dengan status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respon API generate:', result);

      if (result.success) {
        if (result.links && Array.isArray(result.links) && result.links.length > 0) {
          console.log('Berhasil generate links:', result.links);
          setGeneratedLinks(result.links);
          
          // Show email notification if email was sent
          if (result.emailSent) {
            alert(`Link undangan telah berhasil dikirim ke email: ${result.emailAddress}`);
          }
        } else {
          throw new Error('API mengembalikan success tetapi tidak ada links yang dihasilkan');
        }
      } else {
        throw new Error(result.message || 'Gagal membuat tautan undangan.');
      }
    } catch (err) {
      console.error('Error generating links:', err);
      alert('Terjadi kesalahan saat membuat tautan undangan: ' + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset gallery photo
  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Start over - reset everything
  const handleStartOver = () => {
    setStep(1);
    setSelectedTemplate('');
    setTemplateIsPremium(false);
    setOrderId(null);
    setPhotoLink('');
    setMusicLink('');
    setBridePhoto('');
    setGroomPhoto('');
    setGalleryPhotos([]);
    setFormData({
      groom: '',
      bride: '',
      groomFather: '',
      groomMother: '',
      brideFather: '',
      brideMother: '',
      date: '',
      akadDate: '',
      receptionDate: '',
      akadTime: '',
      receptionTime: '',
      akadLocation: '',
      receptionLocation: '',
      address: '',
      location: '',
      mapLink: '',
      guests: [''],
      facebookLink: '',
      instagramLink: '',
      facebookLink1: '',
      instagramLink1: '',
      userEmail: '',
    });
    setGeneratedLinks([]);
  };

  // Render proper step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <TemplateSelector onSelect={handleTemplateSelect} />;
      case 2:
        return (
          <InvitationForm 
            initialData={formData} 
            onSubmit={handleFormSubmit} 
            isPremium={templateIsPremium}
          />
        );
      case 3:
        return (
          <UploadWidget
            onMainPhotoUpload={handlePhotoUpload}
            onMusicUpload={handleMusicUpload}
            onBridePhotoUpload={handleBridePhotoUpload}
            onGroomPhotoUpload={handleGroomPhotoUpload}
            onGalleryUpload={handleGalleryUpload}
            galleryPhotos={galleryPhotos}
            onRemoveGalleryPhoto={removeGalleryPhoto}
            mainPhoto={photoLink}
            musicFile={musicLink}
            bridePhoto={bridePhoto}
            groomPhoto={groomPhoto}
            onComplete={handleUploadComplete}
            setIsUploading={setIsUploading}
            isUploading={isUploading}
          />
        );
      case 4:
        return (
          <GeneratedLinks 
            links={generatedLinks} 
            onStartOver={handleStartOver}
            templateId={selectedTemplate}
          />
        );
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <StepNavigation step={step} />
      </div>
      
      {renderStepContent()}
      
      {step > 1 && step < 4 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Kembali
          </button>
          
          {step === 3 && (
            <button
              onClick={handleUploadComplete}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isUploading ? 'Mengunggah...' : 'Selesai'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// App routes
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
          <InspectWarningModal />
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">Wedding Invitation Creator</h1>
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <footer className="bg-gray-100 mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© 2025 Wedding Invitation Creator. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;