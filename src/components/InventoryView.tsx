import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { formatRupiah } from '../utils/formatters';
import { AddProductModal } from './AddProductModal';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Building2, 
  TrendingUp, 
  ArrowUpDown, 
  RotateCcw,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  Boxes,
  Edit3
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { 
    products, 
    deleteProduct, 
    setRestockModalProduct, 
    stockAlerts, 
    setEditingStockProduct, 
    setEditingFullProduct 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute Inventory Valuation
  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);
  }, [products]);

  const totalSellingValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.currentStock * p.sellingPrice, 0);
  }, [products]);

  const uniqueSuppliersCount = useMemo(() => {
    const suppliers = new Set(products.map((p) => p.supplierName));
    return suppliers.size;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.supplierLocation && p.supplierLocation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Stok & Gudang Koperasi MBG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau ketersediaan bahan pangan secara real-time dengan sistem batas minimum otomatis (Safety Stock)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Komoditas Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Komoditas SKU</span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {products.length} <span className="text-xs font-normal text-slate-500">Bahan Pokok</span>
          </p>
          <span className="text-[11px] text-slate-500 block">Terstandarisasi menu MBG</span>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Nilai Aset Persediaan</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatRupiah(totalInventoryValue)}
          </p>
          <span className="text-[11px] text-emerald-700 block">
            Estimasi Omzet: {formatRupiah(totalSellingValue)}
          </span>
        </div>

        {/* Card 3: Stock Alert Notice */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>Bahan Stok Menipis</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900 tabular-nums">
            {stockAlerts.length} <span className="text-xs font-normal text-amber-700">Komoditas</span>
          </p>
          <span className="text-[11px] text-amber-800 block">
            {stockAlerts.length > 0 ? 'Perlu PO restock ke supplier segera' : 'Semua stok dalam ambang aman'}
          </span>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Mitra Petani & Supplier</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {uniqueSuppliersCount} <span className="text-xs font-normal text-slate-500">Rekan Penyedia</span>
          </p>
          <span className="text-[11px] text-slate-500 block">Kelompok tani & peternak lokal</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari komoditas bahan pokok atau nama supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="karbohidrat">Beras & Karbohidrat</option>
            <option value="unggas_daging">Daging & Unggas</option>
            <option value="ikan_seafood">Ikan & Seafood</option>
            <option value="sayur_buah">Sayuran Segar</option>
            <option value="telur_susu">Telur & Olahan Susu</option>
            <option value="bumbu_minyak">Minyak & Bumbu</option>
          </select>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Komoditas Bahan Pokok</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Status Stok</th>
                <th className="py-3 px-4 text-right">Stok Fisik</th>
                <th className="py-3 px-4 text-right">Batas Min (Safety)</th>
                <th className="py-3 px-4">Supplier Rekanan</th>
                <th className="py-3 px-4 text-right">Harga Beli Modal</th>
                <th className="py-3 px-4 text-right">Harga Jual Dapur</th>
                <th className="py-3 px-4 text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isLow = p.currentStock <= p.minStockThreshold;
                const isOut = p.currentStock <= 0;
                const percentage = Math.min(100, Math.round((p.currentStock / p.minStockThreshold) * 100));

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[11px] text-slate-500">{p.gradeGizi}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {p.category.replace('_', ' ')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Habis</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Menipis</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aman</span>
                        </span>
                      )}
                    </td>

                    {/* Physical Stock with progress bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 tabular-nums">
                          {p.currentStock} {p.unit}
                        </span>
                        <div className="w-16 ml-auto bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(10, percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Safety Minimum Threshold */}
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">
                      {p.minStockThreshold} {p.unit}
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block line-clamp-1">{p.supplierName}</span>
                      <span className="text-[11px] text-slate-400 block line-clamp-1">{p.supplierLocation}</span>
                    </td>

                    {/* Purchase Price */}
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-slate-700">
                      {formatRupiah(p.purchasePrice)}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-700">
                      {formatRupiah(p.sellingPrice)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* 1. Tombol Update Stok Langsung */}
                        <button
                          onClick={() => setEditingStockProduct(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                          title="Update Jumlah Stok / Stock Opname"
                        >
                          <Boxes className="w-3 h-3" />
                          <span>Update Stok</span>
                        </button>

                        {/* 2. Tombol Restock Supplier */}
                        <button
                          onClick={() => setRestockModalProduct(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                          title="Restock dari Supplier"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Restock</span>
                        </button>

                        {/* 3. Tombol Edit Komoditas Lengkap */}
                        <button
                          onClick={() => setEditingFullProduct(p)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
                          title="Edit Komoditas Lengkap"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* 4. Tombol Hapus */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus komoditas ${p.name} dari sistem?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Hapus Komoditas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
