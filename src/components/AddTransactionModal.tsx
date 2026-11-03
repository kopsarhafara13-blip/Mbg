import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import { X, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>('pemasukan');
  const [category, setCategory] = useState('Penjualan Dapur MBG');
  const [amount, setAmount] = useState(1000000);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(`KWT/MBG/${Date.now().toString().slice(-6)}`);
  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank Koperasi' | 'Kas Tunai' | 'Termin SPPG'>('Transfer Bank Koperasi');

  if (!isOpen) return null;

  const incomeCategories = [
    'Penjualan Dapur MBG',
    'Termin SPPG MBG',
    'Simpanan Anggota Koperasi',
    'Pendapatan Logistik Pendingin',
    'Pendapatan Lain-lain',
  ];

  const expenseCategories = [
    'Belanja Supplier',
    'Logistik Armada',
    'Operasional Gudang',
    'Kemasan Higienis MBG',
    'Honor & Upah Staf Sortir',
    'Beban Listrik Cold Storage',
  ];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'pemasukan' ? incomeCategories[0] : expenseCategories[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) return;

    addTransaction({
      date,
      type,
      category,
      amount: Number(amount),
      description,
      invoiceNo,
      paymentMethod,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Catat Transaksi Buku Kas Koperasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Type Toggle */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Jenis Arus Kas</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('pemasukan')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'pemasukan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Pemasukan Kas (In)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('pengeluaran')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'pengeluaran'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Pengeluaran Kas (Out)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kategori Kas</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {(type === 'pemasukan' ? incomeCategories : expenseCategories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nominal Transaksi (Rp)</label>
            <input
              type="number"
              required
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold tabular-nums focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Deskripsi / Keterangan Transaksi</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembayaran solar armada pengiriman Dapur MBG Cluster 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">No. Bukti / Invoice / Kwitansi</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Transfer Bank Koperasi">Transfer Bank Koperasi</option>
                <option value="Kas Tunai">Kas Tunai (Petty Cash)</option>
                <option value="Termin SPPG">Termin SPPG</option>
              </select>
            </div>
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
              className={`px-4 py-2 text-white rounded-lg font-bold shadow-xs ${
                type === 'pemasukan' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
