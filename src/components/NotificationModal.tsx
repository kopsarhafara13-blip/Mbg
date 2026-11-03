import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { AlertTriangle, X, ShoppingCart, CheckCircle, Package } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const {
    stockAlerts,
    notificationModalOpen,
    setNotificationModalOpen,
    products,
    setRestockModalProduct,
  } = useApp();

  if (!notificationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Peringatan Otomatis Stok Menipis ({stockAlerts.length})
              </h3>
              <p className="text-xs text-slate-500">
                Bahan pokok terdeteksi di bawah batas minimum persediaan (Safety Stock)
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {stockAlerts.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">Semua Stok Bahan Pokok Aman</p>
              <p className="text-xs text-slate-500 mt-1">
                Seluruh komoditas gudang koperasi berada di atas ambang batas minimum.
              </p>
            </div>
          ) : (
            stockAlerts.map((alert) => {
              const fullProduct = products.find((p) => p.id === alert.productId);
              const percentage = Math.min(100, Math.round((alert.currentStock / alert.minThreshold) * 100));

              return (
                <div
                  key={alert.productId}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {alert.productName}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        alert.status === 'habis'
                          ? 'bg-red-100 text-red-800'
                          : alert.status === 'kritis'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.status === 'habis' ? 'Stok Habis' : alert.status === 'kritis' ? 'Stok Kritis' : 'Hampir Habis'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>Sisa Stok: <strong className="text-slate-900 tabular-nums">{alert.currentStock} {alert.unit}</strong></span>
                      <span>·</span>
                      <span>Batas Aman: <strong className="text-slate-700 tabular-nums">{alert.minThreshold} {alert.unit}</strong></span>
                      <span>·</span>
                      <span className="text-slate-500">Supplier: {alert.supplierName}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percentage <= 25 ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (fullProduct) {
                        setNotificationModalOpen(false);
                        setRestockModalProduct(fullProduct);
                      }
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Order ke Supplier</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Notifikasi aktif secara real-time berdasarkan safety threshold komoditas.</span>
          <button
            onClick={() => setNotificationModalOpen(false)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
