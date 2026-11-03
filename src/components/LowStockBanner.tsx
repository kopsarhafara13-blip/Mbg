import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export const LowStockBanner: React.FC = () => {
  const {
    stockAlerts,
    setNotificationModalOpen,
    notificationDismissed,
    setNotificationDismissed,
    currentUser,
  } = useApp();

  // Only cooperative operators see the internal safety threshold warnings
  if (currentUser?.role !== 'koperasi' || stockAlerts.length === 0 || notificationDismissed) {
    return null;
  }

  const criticalItems = stockAlerts.filter((a) => a.status === 'habis' || a.status === 'kritis');
  const alertText = criticalItems.length > 0
    ? `${criticalItems.length} bahan pokok dalam kondisi kritis (${criticalItems.map((c) => c.productName.split(' ')[0]).join(', ')})`
    : `${stockAlerts.length} bahan pokok hampir habis di bawah batas aman`;

  return (
    <div className="bg-amber-500/10 border-b border-amber-200 text-amber-900 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-amber-500 text-white shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-900">Peringatan Otomatis Stok: </span>
            <span className="text-amber-800">{alertText}. Segera lakukan pemesanan ulang ke supplier mitra.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setNotificationModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
          >
            <span>Tinjau & Restock Supplier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setNotificationDismissed(true)}
            className="p-1 text-amber-700 hover:text-amber-900 rounded hover:bg-amber-100 transition-colors"
            title="Sembunyikan sementara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
