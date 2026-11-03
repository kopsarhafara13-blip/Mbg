import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { X, Edit3, ArrowRight, Check } from 'lucide-react';

export const EditProductModal: React.FC = () => {
  const { editingFullProduct, setEditingFullProduct, updateProduct } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('karbohidrat');
  const [unit, setUnit] = useState('kg');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [supplierName, setSupplierName] = useState('');
  const [supplierLocation, setSupplierLocation] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [minStockThreshold, setMinStockThreshold] = useState(0);
  const [description, setDescription] = useState('');
  const [gradeGizi, setGradeGizi] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (editingFullProduct) {
      setName(editingFullProduct.name);
      setCategory(editingFullProduct.category);
      setUnit(editingFullProduct.unit);
      setSellingPrice(editingFullProduct.sellingPrice);
      setPurchasePrice(editingFullProduct.purchasePrice);
      setSupplierName(editingFullProduct.supplierName);
      setSupplierLocation(editingFullProduct.supplierLocation || '');
      setCurrentStock(editingFullProduct.currentStock);
      setMinStockThreshold(editingFullProduct.minStockThreshold);
      setDescription(editingFullProduct.description);
      setGradeGizi(editingFullProduct.gradeGizi);
      setIsSaved(false);
    }
  }, [editingFullProduct]);

  if (!editingFullProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !supplierName) return;

    updateProduct({
      ...editingFullProduct,
      name,
      category,
      unit,
      sellingPrice: Number(sellingPrice),
      purchasePrice: Number(purchasePrice),
      supplierName,
      supplierLocation,
      currentStock: Number(currentStock),
      minStockThreshold: Number(minStockThreshold),
      description,
      gradeGizi,
    });

    setIsSaved(true);
    setTimeout(() => {
      setEditingFullProduct(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Edit Data Komoditas Bahan Pokok
            </h3>
          </div>
          <button
            onClick={() => setEditingFullProduct(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Perubahan Berhasil Disimpan!</h4>
            <p className="text-xs text-slate-600">
              Data komoditas <strong>{name}</strong> telah diperbarui di sistem koperasi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Bahan Pokok</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="karbohidrat">Beras & Karbohidrat</option>
                  <option value="unggas_daging">Daging & Unggas</option>
                  <option value="ikan_seafood">Ikan & Seafood</option>
                  <option value="sayur_buah">Sayuran & Buah Segar</option>
                  <option value="telur_susu">Telur & Olahan Susu</option>
                  <option value="bumbu_minyak">Minyak & Bumbu Dapur</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Satuan Volume</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Harga Beli Supplier (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Harga Jual Dapur MBG (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Stok Fisik Gudang ({unit})</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Batas Min / Safety Threshold ({unit})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={minStockThreshold}
                  onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Supplier Penyedia</label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Lokasi Supplier</label>
              <input
                type="text"
                value={supplierLocation}
                onChange={(e) => setSupplierLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Deskripsi & Standar Gizi</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingFullProduct(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors"
              >
                <span>Simpan Perubahan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
