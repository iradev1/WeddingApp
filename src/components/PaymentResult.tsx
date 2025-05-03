import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentResult: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string>('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdParam = queryParams.get('order_id');
    const transactionStatus = queryParams.get('transaction_status');

    if (orderIdParam) {
      setOrderId(orderIdParam);

      // If we have transaction_status from the URL, use it initially
      if (transactionStatus) {
        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
          setStatus('success');
          setStatusDetail('Pembayaran berhasil dikonfirmasi');
        } else if (transactionStatus === 'pending') {
          setStatus('pending');
          setStatusDetail('Menunggu pembayaran');
        } else {
          setStatus('failed');
          setStatusDetail('Pembayaran gagal atau dibatalkan');
        }
      }

      // Check payment status from API
      checkPaymentStatus(orderIdParam);
    } else {
      setLoading(false);
      setStatus('error');
      setStatusDetail('Data pembayaran tidak ditemukan');
    }
  }, [location.search]);

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/payment-status/${orderId}`);
      const result = await response.json();
      
      setLoading(false);
      
      if (result.success) {
        const status = result.data.status;
        
        if (status === 'success') {
          setStatus('success');
          setStatusDetail('Pembayaran berhasil dikonfirmasi');
        } else if (status === 'pending') {
          setStatus('pending');
          setStatusDetail('Menunggu pembayaran');
        } else if (status === 'failed') {
          setStatus('failed');
          setStatusDetail('Pembayaran gagal atau dibatalkan');
        } else if (status === 'fraud') {
          setStatus('failed');
          setStatusDetail('Pembayaran ditolak karena terindikasi fraud');
        }
      } else {
        setStatus('error');
        setStatusDetail('Gagal mendapatkan status pembayaran');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setLoading(false);
      setStatus('error');
      setStatusDetail('Gagal terhubung ke layanan pembayaran');
    }
  };

  const renderStatusIcon = () => {
    if (loading) {
      return <Loader className="w-16 h-16 text-blue-500 animate-spin" />;
    }
    
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      case 'failed':
      case 'error':
      default:
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    if (loading) return 'Memproses Pembayaran';
    
    switch (status) {
      case 'success':
        return 'Pembayaran Berhasil';
      case 'pending':
        return 'Pembayaran Tertunda';
      case 'failed':
        return 'Pembayaran Gagal';
      case 'error':
      default:
        return 'Terjadi Kesalahan';
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleCheckStatus = () => {
    if (orderId) {
      setLoading(true);
      checkPaymentStatus(orderId);
    }
  };

  const handleContinue = () => {
    // Navigate to form page with orderId passed through state
    navigate('/form', { state: { orderId } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <div className="flex flex-col items-center text-center">
        {renderStatusIcon()}
        
        <h1 className="mt-6 text-2xl font-bold text-gray-800">
          {getStatusTitle()}
        </h1>
        
        <p className="mt-2 text-gray-600">
          {statusDetail}
        </p>
        
        {orderId && (
          <div className="mt-4 px-4 py-2 bg-gray-50 rounded text-sm text-gray-700">
            Order ID: {orderId}
          </div>
        )}
        
        <div className="mt-8 space-y-3 w-full max-w-xs">
          {status === 'success' && (
            <button
              onClick={handleContinue}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Lanjutkan
            </button>
          )}
          
          {status === 'pending' && (
            <button
              onClick={handleCheckStatus}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Cek Status Pembayaran
            </button>
          )}
          
          <button
            onClick={handleBackToHome}
            className={`w-full px-4 py-2 ${
              status === 'success' ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'
            } rounded-lg font-medium hover:bg-opacity-90 transition`}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;