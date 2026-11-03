import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Boxes, ArrowRight, AlertTriangle, Plus, Minus } from 'lucide-react';

export const UpdateStockModal: React.FC = () => {
  const { editingStockProduct, setEditingStockProduct, updateStock } = useApp();
  const [stockValue, setStockValue] = useState<number>(0);
  const [minThresholdValue, setMinThresholdValue] = useState<number>(0);
  const [reason, setReason] = useState<string>('Stock Opname Fisik Gudang');
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (editingStockProduct) {
      setStockValue(editingStockProduct.currentStock);
      setMinThresholdValue(editingStockProduct.minStockThreshold);
      setReason('Stock Opname Fisik Gudang');
      setNotes('');
      setIsSaved(false);
    }
  }, [editingStockProduct]);

  if (!editingStockProduct) return null;

  const product = editingStockProduct;
  const difference = stockValue - product.currentStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStock(product.id, stockValue, minThresholdValue, `${reason}: ${notes}`);
    setIsSaved(true);
    setTimeout(() => {
      setEditingStockProduct(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Update & Sesuaikan Stok Bahan Pokok
              </h3>
              <p className="text-xs text-slate-500">
                Penyesuaian stok opname fisik dan batas minimum safety stock
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingStockProduct(null)}
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
            <h4 className="text-base font-bold text-slate-900">Stok Berhasil Diperbarui!</h4>
            <p className="text-xs text-slate-600">
              Stok <strong>{product.name}</strong> kini tercatat <strong>{stockValue} {product.unit}</strong> (Batas Minimum: {minThresholdValue} {product.unit}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Product Info Banner */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500 truncate">Supplier: {product.supplierName}</p>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-slate-600">
                      Stok Tercatat Sekarang: <strong className="text-slate-900 tabular-nums">{product.currentStock} {product.unit}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Stok Fisik Baru */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Jumlah Stok Fisik Riil Terkini ({product.unit})
                  </label>
                  {difference !== 0 && (
                    <span className={`text-[11px] font-bold ${difference > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {difference > 0 ? `+${difference}` : difference} {product.unit} dari stok awal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={stockValue}
                    onChange={(e) => setStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-base font-bold tabular-nums text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <div className="flex gap-1">
                    {[-10, +10, +50, +100].map((delta) => (
                      <button
                        key={delta}
                        type="button"
                        onClick={() => setStockValue((prev) => Math.max(0, prev + delta))}
                        className={`px-2 py-1.5 text-xs font-semibold rounded border transition-colors ${
                          delta > 0
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Batas Minimum (Safety Stock Threshold) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Batas Stok Minimum / Safety Stock ({product.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={minThresholdValue}
                  onChange={(e) => setMinThresholdValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  Notifikasi otomatis akan berbunyi/muncul saat stok berada di bawah atau sama dengan angka ini.
                </p>
              </div>

              {/* Alasan Penyesuaian */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Jenis / Alasan Pembaruan
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Stock Opname Fisik Gudang">Stock Opname Fisik Gudang</option>
                  <option value="Koreksi Selisih Hitung">Koreksi Selisih Hitung</option>
                  <option value="Penerimaan Barang Dari Supplier">Penerimaan Barang Dari Supplier</option>
                  <option value="Penyusutan / Bahan Rusak (Write-off)">Penyusutan / Bahan Rusak (Write-off)</option>
                  <option value="Penyesuaian Lainnya">Penyesuaian Lainnya</option>
                </select>
              </div>

              {/* Status Preview */}
              <div className="p-3 rounded-lg border text-xs flex items-center justify-between bg-slate-50 border-slate-200">
                <span className="text-slate-600">Status Stok Setelah Update:</span>
                {stockValue <= 0 ? (
                  <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Stok Habis (0)</span>
                ) : stockValue <= minThresholdValue ? (
                  <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hampir Habis (Peringatan Aktif)</span>
                  </span>
                ) : (
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Stok Aman ({stockValue} {product.unit})
                  </span>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStockProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <span>Simpan Perubahan Stok</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
