import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { X, PackagePlus, ArrowRight, Check } from 'lucide-react';

export const RestockModal: React.FC = () => {
  const { restockModalProduct, setRestockModalProduct, restockProduct } = useApp();
  const [quantity, setQuantity] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank Koperasi' | 'Kas Tunai'>('Transfer Bank Koperasi');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (restockModalProduct) {
      // Calculate suggested restock quantity to reach 1.5x minimum threshold
      const suggested = Math.max(
        20,
        Math.ceil((restockModalProduct.minStockThreshold * 1.5 - restockModalProduct.currentStock) / 10) * 10
      );
      setQuantity(suggested);
      setSubmitted(false);
    }
  }, [restockModalProduct]);

  if (!restockModalProduct) return null;

  const totalExpense = restockModalProduct.purchasePrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    restockProduct(restockModalProduct.id, quantity, paymentMethod);
    setSubmitted(true);
    setTimeout(() => {
      setRestockModalProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Purchase Order / Restock Supplier
              </h3>
              <p className="text-xs text-slate-500">
                Pengadaan tambahan stok bahan pokok ke supplier mitra
              </p>
            </div>
          </div>
          <button
            onClick={() => setRestockModalProduct(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Restock Berhasil Dicatat!</h4>
            <p className="text-xs text-slate-600">
              Stok <strong>{restockModalProduct.name}</strong> bertambah +{quantity} {restockModalProduct.unit}.
              Pengeluaran sebesar <strong>{formatRupiah(totalExpense)}</strong> otomatis dicatat ke buku kas koperasi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Product Info Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{restockModalProduct.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Supplier: {restockModalProduct.supplierName}</p>
                    {restockModalProduct.supplierContact && (
                      <p className="text-[11px] text-slate-500">{restockModalProduct.supplierContact}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {restockModalProduct.gradeGizi}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Stok Saat Ini</span>
                    <strong className="text-slate-900 tabular-nums">{restockModalProduct.currentStock} {restockModalProduct.unit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Batas Min</span>
                    <strong className="text-amber-700 tabular-nums">{restockModalProduct.minStockThreshold} {restockModalProduct.unit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Harga Modal Beli</span>
                    <strong className="text-slate-900 tabular-nums">{formatRupiah(restockModalProduct.purchasePrice)}/{restockModalProduct.unit}</strong>
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Jumlah Pasokan yang Dipesan ({restockModalProduct.unit})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <div className="flex gap-1">
                    {[20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setQuantity((prev) => prev + amt)}
                        className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition-colors"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Stok setelah restock:{' '}
                  <strong className="text-emerald-700 tabular-nums">
                    {restockModalProduct.currentStock + quantity} {restockModalProduct.unit}
                  </strong>
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Metode Pembayaran Kas Koperasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Transfer Bank Koperasi', 'Kas Tunai'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                        paymentMethod === method
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-800 font-medium block">Total Pengeluaran Kas:</span>
                  <span className="text-[11px] text-emerald-600">
                    {quantity} {restockModalProduct.unit} × {formatRupiah(restockModalProduct.purchasePrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-900 tabular-nums block">
                    {formatRupiah(totalExpense)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Otomatis Masuk Buku Kas</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRestockModalProduct(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <span>Konfirmasi Restock & Catat Biaya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
