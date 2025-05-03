import React, { useState } from 'react';

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
  userEmail?: string; // Add email field
}

interface InvitationFormProps {
  initialData: FormData;
  onSubmit: (data: FormData) => void;
  isPremium: boolean;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ initialData, onSubmit, isPremium }) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle guest list changes
  const handleGuestChange = (index: number, value: string) => {
    const newGuests = [...formData.guests];
    newGuests[index] = value;
    setFormData({ ...formData, guests: newGuests });
  };

  // Add new guest input
  const addGuestInput = () => {
    setFormData({ ...formData, guests: [...formData.guests, ''] });
  };

  // Remove guest input
  const removeGuestInput = (index: number) => {
    const newGuests = [...formData.guests];
    newGuests.splice(index, 1);
    setFormData({ ...formData, guests: newGuests });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form (add more validation as needed)
    if (!formData.bride.trim() || !formData.groom.trim()) {
      alert('Nama pasangan pengantin wajib diisi');
      return;
    }
    
    if (formData.guests.filter(g => g.trim() !== '').length === 0) {
      alert('Tambahkan setidaknya satu nama tamu');
      return;
    }

    // Email validation
    if (formData.userEmail && !validateEmail(formData.userEmail)) {
      alert('Format email tidak valid');
      return;
    }
    
    onSubmit(formData);
  };

  // Email validation function
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Informasi Undangan Pernikahan</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Couple Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informasi Pasangan</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengantin Pria</label>
                <input
                  type="text"
                  name="groom"
                  value={formData.groom}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama lengkap pengantin pria"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengantin Wanita</label>
                <input
                  type="text"
                  name="bride"
                  value={formData.bride}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama lengkap pengantin wanita"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Orang Tua Pengantin Pria</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah</label>
                <input
                  type="text"
                  name="groomFather"
                  value={formData.groomFather}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama ayah pengantin pria"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input
                  type="text"
                  name="groomMother"
                  value={formData.groomMother}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama ibu pengantin pria"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Orang Tua Pengantin Wanita</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah</label>
                <input
                  type="text"
                  name="brideFather"
                  value={formData.brideFather}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama ayah pengantin wanita"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input
                  type="text"
                  name="brideMother"
                  value={formData.brideMother}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama ibu pengantin wanita"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Email Pengguna (Untuk Pengiriman Link)</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="contoh@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Opsional. Masukkan alamat email untuk menerima link undangan.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Media Sosial (Opsional)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pria</label>
                  <input
                    type="text"
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="URL Facebook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Pria</label>
                  <input
                    type="text"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="URL Instagram"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Wanita</label>
                  <input
                    type="text"
                    name="facebookLink1"
                    value={formData.facebookLink1}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="URL Facebook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Wanita</label>
                  <input
                    type="text"
                    name="instagramLink1"
                    value={formData.instagramLink1}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="URL Instagram"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informasi Acara</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pernikahan</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akad</label>
                  <input
                    type="date"
                    name="akadDate"
                    value={formData.akadDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Akad</label>
                  <input
                    type="time"
                    name="akadTime"
                    value={formData.akadTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Akad</label>
                <input
                  type="text"
                  name="akadLocation"
                  value={formData.akadLocation}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama tempat akad nikah"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Resepsi</label>
                  <input
                    type="date"
                    name="receptionDate"
                    value={formData.receptionDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Resepsi</label>
                  <input
                    type="time"
                    name="receptionTime"
                    value={formData.receptionTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Resepsi</label>
                <input
                  type="text"
                  name="receptionLocation"
                  value={formData.receptionLocation}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nama tempat resepsi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Alamat lengkap acara pernikahan"
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps (Opsional)</label>
                <input
                  type="text"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="URL Google Maps"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">Daftar Tamu</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tambahkan nama tamu untuk membuat tautan undangan yang unik untuk setiap tamu
              </p>
              
              {formData.guests.map((guest, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={guest}
                    onChange={(e) => handleGuestChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded-md"
                    placeholder={`Nama Tamu ${index + 1}`}
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeGuestInput(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                    disabled={formData.guests.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addGuestInput}
                className="w-full p-2 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Tamu
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Lanjutkan ke Upload Media
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvitationForm;