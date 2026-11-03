import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Building, Check, ArrowRight } from 'lucide-react';

export const EditCooperativeModal: React.FC = () => {
  const { 
    cooperativeProfile, 
    updateCooperativeProfile, 
    editingCooperativeModalOpen, 
    setEditingCooperativeModalOpen 
  } = useApp();

  const [name, setName] = useState(cooperativeProfile.name);
  const [subtitle, setSubtitle] = useState(cooperativeProfile.subtitle);
  const [legalNumber, setLegalNumber] = useState(cooperativeProfile.legalNumber);
  const [address, setAddress] = useState(cooperativeProfile.address);
  const [phone, setPhone] = useState(cooperativeProfile.phone);
  const [email, setEmail] = useState(cooperativeProfile.email);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(cooperativeProfile.name);
    setSubtitle(cooperativeProfile.subtitle);
    setLegalNumber(cooperativeProfile.legalNumber);
    setAddress(cooperativeProfile.address);
    setPhone(cooperativeProfile.phone);
    setEmail(cooperativeProfile.email);
    setIsSaved(false);
  }, [cooperativeProfile, editingCooperativeModalOpen]);

  if (!editingCooperativeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCooperativeProfile({
      name: name.trim(),
      subtitle: subtitle.trim(),
      legalNumber: legalNumber.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    setIsSaved(true);
    setTimeout(() => {
      setEditingCooperativeModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Identitas & Profil Koperasi
              </h3>
              <p className="text-xs text-slate-500">
                Ubah nama koperasi, legalitas, alamat, dan kontak resmi
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingCooperativeModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Profil Koperasi Berhasil Diperbarui!</h4>
            <p className="text-xs text-slate-600">
              Nama koperasi kini menjadi <strong>{name}</strong> dan diterapkan ke seluruh sistem, faktur, serta surat jalan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Resmi Koperasi</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Koperasi Pemasaran Haadza Minfadly Rabbi"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Deskripsi Singkat / Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Pemasok Resmi Bahan Pokok Dapur Program MBG & SPPG"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nomor Legalitas / SK Kemenkumham</label>
              <input
                type="text"
                value={legalNumber}
                onChange={(e) => setLegalNumber(e.target.value)}
                placeholder="Contoh: Badan Hukum No. AHU-0019284.AH.01.26"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Alamat Kantor / Pusat Pergudangan</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat gudang dan distribusi..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-XXXX-XXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kontak@koperasi.id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingCooperativeModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors"
              >
                <span>Simpan Profil Koperasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
