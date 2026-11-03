import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Bell, 
  Sprout, 
  RefreshCw, 
  Building2, 
  LogOut, 
  UtensilsCrossed,
  ShieldCheck,
  UserCircle,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartItemCount,
    setCartDrawerOpen,
    stockAlerts,
    setNotificationModalOpen,
    resetToDefault,
    cooperativeProfile,
    setEditingCooperativeModalOpen,
    currentUser,
    logout,
  } = useApp();

  const isKoperasi = currentUser?.role === 'koperasi';
  const isDapur = currentUser?.role === 'dapur';

  // Role-based navigation tabs
  const navItems = isDapur
    ? [
        { id: 'marketplace', label: 'Katalog Pemesanan MBG' },
        { id: 'orders', label: 'Pesanan Dapur Saya' },
      ] as const
    : [
        { id: 'marketplace', label: 'Katalog Bahan' },
        { id: 'inventory', label: 'Stok Koperasi' },
        { id: 'orders', label: 'Pesanan Dapur MBG' },
        { id: 'finance', label: 'Pemasukan & Pengeluaran' },
        { id: 'reports', label: 'Laporan Keuangan' },
      ] as const;

  const lowStockCount = stockAlerts.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark with Edit Profile trigger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2.5 text-left group shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 block leading-tight max-w-[190px] sm:max-w-xs truncate">
                  {cooperativeProfile.name}
                </span>
                <span className="text-[11px] text-emerald-800 font-medium block leading-tight truncate">
                  {cooperativeProfile.subtitle}
                </span>
              </div>
            </button>

            {isKoperasi && (
              <button
                onClick={() => setEditingCooperativeModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                title="Edit Nama / Profil Koperasi"
                aria-label="Edit Nama Koperasi"
              >
                <Building2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links based on logged-in role */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {item.id === 'inventory' && isKoperasi && lowStockCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title={`${lowStockCount} bahan stok menipis`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Role Info, Alerts, Cart & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active User Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                {isDapur ? (
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                )}
                <div className="text-left leading-tight">
                  <span className="font-bold text-slate-800 block text-[11px] max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isDapur ? 'Pihak Dapur MBG' : 'Pengurus Koperasi'}
                  </span>
                </div>
              </div>
            )}

            {/* Stock Alert Notification Bell (Only for Koperasi) */}
            {isKoperasi && (
              <button
                onClick={() => setNotificationModalOpen(true)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifikasi Stok Menipis"
                aria-label="Notifikasi Stok"
              >
                <Bell className="w-5 h-5" />
                {lowStockCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                    {lowStockCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartItemCount > 0 && (
                <span className="bg-emerald-800 text-white px-1.5 py-0.2 rounded-full text-xs font-bold tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Reset Demo Data (Koperasi only) */}
            {isKoperasi && (
              <button
                onClick={() => {
                  if (window.confirm('Muat ulang data awal simulasi Koperasi MBG?')) {
                    resetToDefault();
                  }
                }}
                className="hidden md:flex items-center gap-1 text-slate-400 hover:text-slate-700 p-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset Simulasi Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Unduh Versi File HTML Mandiri */}
            <a
              href="/koperasi_pemasaran_haadza_minfadly_standalone.html"
              download="koperasi_pemasaran_haadza_minfadly.html"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
              title="Unduh seluruh website ini dalam 1 file HTML mandiri (bisa dibuka offline)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Format .HTML</span>
            </a>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
