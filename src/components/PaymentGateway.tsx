import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface PaymentGatewayProps {
  templateId: string;
  templateName: string;
  price: number;
  onPaymentSuccess: (orderId: string) => void;
  onBack: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  templateId,
  templateName,
  price,
  onPaymentSuccess,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string>('');
  const [midtransClientKey, setMidtransClientKey] = useState<string>('');

  useEffect(() => {
    const fetchMidtransKey = async () => {
      try {
        const response = await fetch('/api/midtrans-client-key');
        const data = await response.json();
        if (data.clientKey) {
          setMidtransClientKey(data.clientKey);
        } else {
          setError('Failed to get payment gateway configuration');
        }
      } catch (err) {
        console.error('Error fetching Midtrans client key:', err);
        setError('Failed to connect to payment service');
      }
    };

    fetchMidtransKey();
  }, []);

  useEffect(() => {
    if (!midtransClientKey) return;
    const script = document.createElement('script');
   script.src = 'https://app.midtrans.com/snap/snap.js';

    script.setAttribute('data-client-key', midtransClientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [midtransClientKey]);

  const createPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, price }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('❌ Payment creation failed:', result);
        setError(result.message || 'Gagal membuat pembayaran.');
        setLoading(false);
        return;
      }

      setOrderId(result.orderId);
      console.log("🧾 Token diterima:", result.token);
      console.log("🔐 window.snap:", window.snap);

      if (window.snap && result.token) {
        window.snap.pay(result.token, {
          onSuccess: function (snapResult: any) {
            console.log("✅ Snap success:", snapResult);
            handlePaymentUpdate('success', snapResult.order_id);
          },
          onPending: function (snapResult: any) {
            console.log("⏳ Snap pending:", snapResult);
            handlePaymentUpdate('pending', snapResult.order_id);
          },
          onError: function (snapResult: any) {
            console.error("❌ Snap error:", snapResult);
            handlePaymentUpdate('failed', snapResult.order_id);
          },
          onClose: function () {
            if (result.orderId) {
              console.warn("🚪 Snap popup closed. Checking status for:", result.orderId);
              checkPaymentStatus(result.orderId);
            } else {
              console.warn("⚠️ Snap popup closed, tapi orderId tidak tersedia.");
            }
          }
        });
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setError('Payment system is unavailable');
      }
    } catch (err: any) {
      console.error('Error creating payment:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (err.message === 'certificate has expired') {
        setError('SSL certificate has expired. Please contact support.');
      } else {
        setError(err.message || 'Failed to connect to payment service');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = (status: string, orderId: string) => {
    setPaymentStatus(status);
    setOrderId(orderId);
    if (status === 'success') {
      setStatusDetail('Pembayaran berhasil dikonfirmasi');
      onPaymentSuccess(orderId);
    } else if (status === 'pending') {
      setStatusDetail('Menunggu pembayaran');
      checkPaymentStatus(orderId);
    } else {
      setStatusDetail('Pembayaran gagal atau dibatalkan');
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/payment-status/${orderId}`);
      if (!response.ok) {
        console.error('Payment status check failed:', response.status);
        return;
      }
      const result = await response.json();
      if (result.success) {
        const status = result.data.status;
        setPaymentStatus(status);
        if (status === 'success') {
          setStatusDetail('Pembayaran berhasil dikonfirmasi');
          onPaymentSuccess(orderId);
        } else if (status === 'pending') {
          setStatusDetail('Menunggu pembayaran');
          setTimeout(() => checkPaymentStatus(orderId), 5000);
        } else if (status === 'failed') {
          setStatusDetail('Pembayaran gagal atau dibatalkan');
        } else if (status === 'fraud') {
          setStatusDetail('Pembayaran ditolak karena terindikasi fraud');
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setTimeout(() => checkPaymentStatus(orderId), 10000);
    }
  };

  const retryPayment = () => {
    setError(null);
    createPayment();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Pembayaran Template Premium</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
          {error === 'certificate has expired' && (
            <button onClick={retryPayment} className="ml-4 px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
              Coba Lagi
            </button>
          )}
        </div>
      )}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Template:</span>
          <span>{templateName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Harga:</span>
          <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(price)}</span>
        </div>
      </div>
      {paymentStatus ? (
        <div className={`p-4 rounded-lg mb-6 ${
          paymentStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {paymentStatus === 'success' ? (
              <CheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <AlertTriangle className="w-6 h-6 mr-2" />
            )}
            <span className="font-bold">
              Status: {paymentStatus === 'success' ? 'Sukses' : paymentStatus === 'pending' ? 'Menunggu Pembayaran' : 'Gagal'}
            </span>
          </div>
          <p>{statusDetail}</p>
          {orderId && <p className="text-sm mt-2">Order ID: {orderId}</p>}
        </div>
      ) : (
        <div className="flex justify-center space-x-4 mb-4">
          <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">
            Kembali
          </button>
          <button
            onClick={createPayment}
            disabled={loading || !midtransClientKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        </div>
      )}
      {paymentStatus === 'success' && (
        <button onClick={() => onPaymentSuccess(orderId || '')} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition mt-4">
          Lanjutkan
        </button>
      )}
      {paymentStatus === 'pending' && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 mb-2">Menunggu konfirmasi pembayaran...</p>
          <button onClick={() => checkPaymentStatus(orderId || '')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
            Cek Status Pembayaran
          </button>
        </div>
      )}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Pembayaran diproses oleh Midtrans - Layanan Payment Gateway Aman</p>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default PaymentGateway;
