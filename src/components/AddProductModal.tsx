import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types';
import { X, Plus, Package } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('sayur_buah');
  const [unit, setUnit] = useState('kg');
  const [sellingPrice, setSellingPrice] = useState(25000);
  const [purchasePrice, setPurchasePrice] = useState(20000);
  const [supplierName, setSupplierName] = useState('');
  const [supplierLocation, setSupplierLocation] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [currentStock, setCurrentStock] = useState(100);
  const [minStockThreshold, setMinStockThreshold] = useState(50);
  const [description, setDescription] = useState('');
  const [gradeGizi, setGradeGizi] = useState('Grade A Standar MBG');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !supplierName) return;

    addProduct({
      name,
      category,
      unit,
      sellingPrice: Number(sellingPrice),
      purchasePrice: Number(purchasePrice),
      supplierName,
      supplierLocation,
      supplierContact,
      currentStock: Number(currentStock),
      minStockThreshold: Number(minStockThreshold),
      description: description || `Komoditas bahan pangan berkualitas untuk pasokan dapur program gizi MBG.`,
      gradeGizi,
      isLocalProduce: true,
      leadTimeDays: 1,
      image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Tambah Komoditas Bahan Pokok Baru
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Bahan Pokok</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Daging Ikan Gurame Fillet Segar"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kategori Bahan Pokok</label>
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
                placeholder="Contoh: kg, liter, ikat, tray"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Harga Modal Beli Supplier (Rp)</label>
              <input
                type="number"
                required
                min="100"
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
                min="100"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between">
            <span className="text-emerald-800 font-medium">Estimasi Margin Koperasi:</span>
            <span className="font-bold text-emerald-900 tabular-nums">
              Rp {(sellingPrice - purchasePrice).toLocaleString('id-ID')} / {unit}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Stok Awal Gudang</label>
              <input
                type="number"
                required
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Batas Minimum (Pemicu Notifikasi)</label>
              <input
                type="number"
                required
                min="1"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Supplier / Petani Penyedia</label>
            <input
              type="text"
              required
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Contoh: Gapoktan Subur Lestari"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Asal Daerah / Lokasi Supplier</label>
              <input
                type="text"
                value={supplierLocation}
                onChange={(e) => setSupplierLocation(e.target.value)}
                placeholder="Contoh: Sukabumi, Jawa Barat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kontak Supplier</label>
              <input
                type="text"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="0812-XXXX-XXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Deskripsi / Standar Pangan</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spesifikasi kualitas bahan pangan..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
            >
              Simpan Komoditas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
