import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { AddTransactionModal } from './AddTransactionModal';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  Plus, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  Trash2,
  CreditCard,
  Receipt
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { transactions, deleteTransaction, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Financial aggregates
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.invoiceNo && t.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pemasukan & Pengeluaran Koperasi MBG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Buku kas harian transaksi penjualan dapur MBG, belanja supplier, logistik armada pendingin, dan operasional
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Lihat Laporan Lengkap</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Kas</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pemasukan */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pemasukan Kas</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            +{formatRupiah(totalIncome)}
          </p>
          <span className="text-[11px] text-slate-500 block">
            Penjualan Dapur MBG & termin pemerintah
          </span>
        </div>

        {/* Total Pengeluaran */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pengeluaran Kas</span>
            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-red-700 tabular-nums">
            -{formatRupiah(totalExpense)}
          </p>
          <span className="text-[11px] text-slate-500 block">
            Belanja supplier petani, logistik, & operasional
          </span>
        </div>

        {/* Saldo Kas Berjalan */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Saldo Kas Berjalan (Net Cash)</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-extrabold tabular-nums ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {formatRupiah(netBalance)}
          </p>
          <span className="text-[11px] text-slate-500 block">
            Likuiditas dana operasional koperasi
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari keterangan, kategori, atau nomor bukti kwitansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Mutasi ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('pemasukan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'pemasukan'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pemasukan ({transactions.filter((t) => t.type === 'pemasukan').length})
          </button>
          <button
            onClick={() => setFilterType('pengeluaran')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'pengeluaran'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pengeluaran ({transactions.filter((t) => t.type === 'pengeluaran').length})
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Arus Kas</th>
                <th className="py-3 px-4">Kategori Akun</th>
                <th className="py-3 px-4">Keterangan / Transaksi</th>
                <th className="py-3 px-4">No. Bukti / Invoice</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Nominal (Rp)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((trx) => {
                const isIncome = trx.type === 'pemasukan';

                return (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(trx.date)}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isIncome ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{isIncome ? 'Pemasukan' : 'Pengeluaran'}</span>
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {trx.category}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-slate-700 min-w-[200px]">
                      {trx.description}
                    </td>

                    {/* Invoice */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {trx.invoiceNo || '-'}
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                      {trx.paymentMethod}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right tabular-nums font-bold whitespace-nowrap">
                      <span className={isIncome ? 'text-emerald-700' : 'text-red-700'}>
                        {isIncome ? '+' : '-'} {formatRupiah(trx.amount)}
                      </span>
                    </td>

                    {/* Delete action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus transaksi ini dari buku kas?')) {
                            deleteTransaction(trx.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
