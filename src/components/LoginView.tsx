import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { 
  Building2, 
  UtensilsCrossed, 
  ShieldCheck, 
  ArrowRight, 
  Sprout, 
  Lock, 
  Mail, 
  CheckCircle2,
  Users,
  Store,
  Download
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, cooperativeProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('dapur');
  
  // Form fields
  const [email, setEmail] = useState('dapur.cibinong@mbg.id');
  const [password, setPassword] = useState('••••••••');
  const [kitchenName, setKitchenName] = useState('Dapur Sentral SPPG MBG Kec. Cibinong 01');
  const [personName, setPersonName] = useState('Ibu Ratna (Ka. Dapur SPPG)');
  const [contact, setContact] = useState('0812-9876-5432');

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'dapur') {
      setEmail('dapur.cibinong@mbg.id');
      setPersonName('Ibu Ratna (Ka. Dapur SPPG)');
      setKitchenName('Dapur Sentral SPPG MBG Kec. Cibinong 01');
      setContact('0812-9876-5432');
    } else {
      setEmail('admin@haadzaminfadly.id');
      setPersonName('Ahmad Fauzi, SE (Pengurus Koperasi)');
      setKitchenName('');
      setContact('0812-8872-9900');
    }
  };

  const handleQuickLoginDapur = (kitchen: string, pic: string, mail: string, phone: string) => {
    const user: User = {
      id: `usr-dapur-${Date.now()}`,
      name: pic,
      email: mail,
      role: 'dapur',
      kitchenName: kitchen,
      kitchenContact: phone,
    };
    login(user);
  };

  const handleQuickLoginKoperasi = (name: string, mail: string) => {
    const user: User = {
      id: `usr-kop-${Date.now()}`,
      name,
      email: mail,
      role: 'koperasi',
    };
    login(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: User = {
      id: `usr-${Date.now()}`,
      name: personName || (selectedRole === 'dapur' ? 'Petugas Dapur MBG' : 'Pengurus Koperasi'),
      email,
      role: selectedRole,
      kitchenName: selectedRole === 'dapur' ? kitchenName : undefined,
      kitchenContact: selectedRole === 'dapur' ? contact : undefined,
    };
    login(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Sprout className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {cooperativeProfile.name}
        </h1>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Portal Sistem Marketplace & Logistik Bahan Pokok Dapur Program Makan Bergizi Gratis (MBG)
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Wajib Login Sebelum Mengakses Transaksi</span>
        </div>

        <div className="pt-2">
          <a
            href="/koperasi_pemasaran_haadza_minfadly_standalone.html"
            download="koperasi_pemasaran_haadza_minfadly.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            title="Unduh seluruh website ini dalam format satu file HTML mandiri"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unduh Versi Website Format HTML Mandiri (.html)</span>
          </a>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* Role Selection Tabs (2 Alur Login) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
              Pilih Alur Akses Masuk:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleTabChange('dapur')}
                className={`py-3 px-3 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'dapur'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Pihak Dapur MBG</span>
                <span className="text-[10px] font-normal text-slate-500">Pemesanan Bahan</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange('koperasi')}
                className={`py-3 px-3 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'koperasi'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>Pihak Koperasi</span>
                <span className="text-[10px] font-normal text-slate-500">Gudang, Stok & Keuangan</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Pilihan Akun Cepat ({selectedRole === 'dapur' ? 'Dapur MBG' : 'Pengurus Koperasi'}):
            </span>
            
            {selectedRole === 'dapur' ? (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLoginDapur(
                    'Dapur Sentral SPPG MBG Kec. Cibinong 01',
                    'Ibu Ratna (Ka. Dapur SPPG)',
                    'dapur.cibinong@mbg.id',
                    '0812-9876-5432'
                  )}
                  className="w-full p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="text-slate-900 block group-hover:text-emerald-700">Dapur Sentral SPPG Cibinong 01</strong>
                    <span className="text-[11px] text-slate-500">PIC: Ibu Ratna · 1.500 Porsi Siswa</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginDapur(
                    'Dapur MBG Sekolah Mandiri Gizi Sukamaju',
                    'Bpk. Dedi Kurniawan (Koord. Dapur)',
                    'dapur.sukamaju@mbg.id',
                    '0856-4433-2211'
                  )}
                  className="w-full p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="text-slate-900 block group-hover:text-emerald-700">Dapur Mandiri Gizi Sukamaju</strong>
                    <span className="text-[11px] text-slate-500">PIC: Bpk. Dedi · 800 Porsi Siswa</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLoginKoperasi(
                    'Ahmad Fauzi, SE (Manajer Koperasi)',
                    'admin@haadzaminfadly.id'
                  )}
                  className="w-full p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="text-slate-900 block group-hover:text-emerald-700">Pengurus & Manajer Koperasi</strong>
                    <span className="text-[11px] text-slate-500">Ahmad Fauzi, SE · Akses Penuh Kas & Stok</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginKoperasi(
                    'Hendra Gunawan (Kepala Gudang & Logistik)',
                    'gudang@haadzaminfadly.id'
                  )}
                  className="w-full p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="text-slate-900 block group-hover:text-emerald-700">Kepala Gudang & Armada Logistik</strong>
                    <span className="text-[11px] text-slate-500">Hendra Gunawan · Kontrol Stok & Pengiriman</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
              </div>
            )}
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500">Atau login manual dengan kredensial</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {selectedRole === 'dapur' ? 'Email / Akun Dapur MBG' : 'Email Petugas Koperasi'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                  placeholder="nama@domain.id"
                />
              </div>
            </div>

            {selectedRole === 'dapur' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Satuan Dapur MBG</label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Dapur Sentral SPPG Cibinong"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Masuk Sebagai {selectedRole === 'dapur' ? 'Pihak Dapur MBG' : 'Pihak Koperasi'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Feature Privilege Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <strong className="text-slate-700 block">Hak Akses {selectedRole === 'dapur' ? 'Dapur MBG' : 'Koperasi'}:</strong>
            {selectedRole === 'dapur' ? (
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Katalog pemesanan bahan pokok (harga resmi jual dapur).</li>
                <li>Pemesanan pasokan & keranjang belanja menu harian.</li>
                <li>Riwayat pesanan dapur & cetak surat jalan / faktur.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Kelola stok gudang, stock opname & batas safety threshold.</li>
                <li>Kelola pesanan masuk seluruh dapur MBG & armada kirim.</li>
                <li>Pencatatan kas pemasukan, pengeluaran & laporan laba rugi.</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
