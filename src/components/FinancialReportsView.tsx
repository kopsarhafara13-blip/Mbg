import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Sprout, 
  ArrowUpRight,
  Boxes,
  Calendar
} from 'lucide-react';

export const FinancialReportsView: React.FC = () => {
  const { transactions, products, orders, cooperativeProfile } = useApp();
  const [period, setPeriod] = useState<'all' | 'month' | 'today'>('all');

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = todayStr.slice(0, 7);

    return transactions.filter((t) => {
      if (period === 'today') return t.date === todayStr;
      if (period === 'month') return t.date.startsWith(currentMonthStr);
      return true;
    });
  }, [transactions, period]);

  // Income Breakdown
  const incomeItems = useMemo(() => {
    return filteredTransactions.filter((t) => t.type === 'pemasukan');
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => {
    return incomeItems.reduce((sum, t) => sum + t.amount, 0);
  }, [incomeItems]);

  // Expense Breakdown
  const expenseItems = useMemo(() => {
    return filteredTransactions.filter((t) => t.type === 'pengeluaran');
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return expenseItems.reduce((sum, t) => sum + t.amount, 0);
  }, [expenseItems]);

  // HPP (Belanja Supplier)
  const hppExpense = useMemo(() => {
    return expenseItems
      .filter((t) => t.category === 'Belanja Supplier')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [expenseItems]);

  // Operating Expenses (Logistik, Gudang, Kemasan, dll)
  const operationalExpense = useMemo(() => {
    return expenseItems
      .filter((t) => t.category !== 'Belanja Supplier')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [expenseItems]);

  // Gross Profit (Laba Kotor)
  const grossProfit = totalIncome - hppExpense;
  const grossMarginPercent = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(1) : '0';

  // Net Profit (Sisa Hasil Usaha / SHU)
  const netProfit = totalIncome - totalExpense;
  const netMarginPercent = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  // Inventory valuation
  const inventoryAssetValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);
  }, [products]);

  // Category breakdown for expenses
  const expenseCategoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenseItems.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenseItems]);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['ID Transaksi', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'No Bukti', 'Metode Bayar', 'Nominal (Rp)'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.type === 'pemasukan' ? 'Pemasukan (Inflow)' : 'Pengeluaran (Outflow)',
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.invoiceNo || '-',
      t.paymentMethod,
      t.amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Koperasi_MBG_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Print/Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan Keuangan Otomatis & Real-Time
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Laba rugi, arus kas, nilai persediaan aset, dan performa keuangan pasokan dapur MBG
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Period selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <button
              onClick={() => setPeriod('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                period === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Periode
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                period === 'month' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setPeriod('today')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                period === 'today' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div id="printable-financial-report" className="space-y-6">
        {/* Printable Official Letterhead (Visible on print) */}
        <div className="hidden print:block border-b-2 border-emerald-700 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase">{cooperativeProfile.name}</h2>
                <p className="text-xs text-slate-600">Laporan Keuangan & Akuntabilitas Pasokan Dapur MBG ({cooperativeProfile.legalNumber})</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Tanggal Cetak: {formatDate(new Date().toISOString())}</p>
              <p>Status: Laporan Real-Time Terverifikasi</p>
            </div>
          </div>
        </div>

        {/* 4 Core Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Pendapatan Penjualan */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Total Pendapatan (Revenue)</span>
            <p className="text-xl font-extrabold text-emerald-700 tabular-nums">
              {formatRupiah(totalIncome)}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Dari {incomeItems.length} transaksi pemasukan
            </span>
          </div>

          {/* 2. Beban Pokok Penjualan (HPP) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">HPP / Belanja Supplier</span>
            <p className="text-xl font-extrabold text-slate-800 tabular-nums">
              {formatRupiah(hppExpense)}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Biaya modal bahan pokok ke petani
            </span>
          </div>

          {/* 3. Laba Bersih (SHU) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Sisa Hasil Usaha (SHU / Net)</span>
            <p className={`text-xl font-extrabold tabular-nums ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {formatRupiah(netProfit)}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium block">
              Margin Bersih: {netMarginPercent}%
            </span>
          </div>

          {/* 4. Nilai Aset Stok */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500">Nilai Aset Stok Persediaan</span>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums">
              {formatRupiah(inventoryAssetValue)}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Total {products.length} komoditas di gudang
            </span>
          </div>
        </div>

        {/* Laporan Laba Rugi Resmi (Format Akuntansi Koperasi) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Laporan Perhitungan Hasil Usaha (Laba / Rugi) Koperasi MBG
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Periode: {period === 'all' ? 'Seluruh Transaksi' : period === 'month' ? 'Bulan Berjalan' : 'Hari Ini'}
            </span>
          </div>

          <div className="p-6 space-y-6 text-xs">
            {/* Bagian I: Pendapatan */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
                <span>I. Pendapatan Operasional Koperasi</span>
                <span className="tabular-nums text-emerald-700 font-bold">{formatRupiah(totalIncome)}</span>
              </h4>
              <div className="pl-4 space-y-1.5 text-slate-700">
                {incomeItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-0.5 hover:bg-slate-50">
                    <span>{item.description} ({item.category})</span>
                    <span className="tabular-nums font-medium text-slate-900">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
                {incomeItems.length === 0 && (
                  <p className="text-slate-400 italic">Belum ada pendapatan tercatat pada periode ini.</p>
                )}
              </div>
            </div>

            {/* Bagian II: Beban Pokok Penjualan (HPP) */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
                <span>II. Beban Pokok Penjualan (HPP / Belanja Supplier Petani)</span>
                <span className="tabular-nums text-slate-800 font-bold">({formatRupiah(hppExpense)})</span>
              </h4>
              <div className="pl-4 space-y-1.5 text-slate-700">
                {expenseItems
                  .filter((t) => t.category === 'Belanja Supplier')
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-0.5 hover:bg-slate-50">
                      <span>{item.description}</span>
                      <span className="tabular-nums font-medium text-slate-900">{formatRupiah(item.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Laba Kotor Usaha */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center font-bold text-xs">
              <span className="text-slate-900 uppercase">LABA KOTOR KOPERASI (Gross Margin: {grossMarginPercent}%)</span>
              <span className="text-emerald-700 text-sm tabular-nums font-extrabold">{formatRupiah(grossProfit)}</span>
            </div>

            {/* Bagian III: Beban Operasional */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
                <span>III. Beban Operasional & Distribusi Logistik</span>
                <span className="tabular-nums text-red-700 font-bold">({formatRupiah(operationalExpense)})</span>
              </h4>
              <div className="pl-4 space-y-1.5 text-slate-700">
                {expenseItems
                  .filter((t) => t.category !== 'Belanja Supplier')
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-0.5 hover:bg-slate-50">
                      <span>{item.description} ({item.category})</span>
                      <span className="tabular-nums font-medium text-slate-900">{formatRupiah(item.amount)}</span>
                    </div>
                  ))}
                {expenseItems.filter((t) => t.category !== 'Belanja Supplier').length === 0 && (
                  <p className="text-slate-400 italic">Tidak ada beban operasional lain pada periode ini.</p>
                )}
              </div>
            </div>

            {/* Sisa Hasil Usaha (Laba Bersih Koperasi) */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-sm font-extrabold">
              <div>
                <span className="text-emerald-950 uppercase block">
                  SISA HASIL USAHA (SHU) / LABA BERSIH BERJALAN
                </span>
                <span className="text-[11px] font-normal text-emerald-700">
                  Efisiensi margin bersih: {netMarginPercent}% dari total omzet
                </span>
              </div>
              <span className="text-lg font-black text-emerald-900 tabular-nums">
                {formatRupiah(netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Commodity Performance Summary */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Rincian Nilai Aset Stok Komoditas Bahan Pokok MBG
            </h3>
            <span className="text-xs text-slate-500">
              Total Valuasi: <strong className="text-slate-900 tabular-nums">{formatRupiah(inventoryAssetValue)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/50">
                  <th className="py-2.5 px-4">Komoditas Bahan</th>
                  <th className="py-2.5 px-4">Supplier Penyedia</th>
                  <th className="py-2.5 px-4 text-right">Stok Fisik</th>
                  <th className="py-2.5 px-4 text-right">Harga Modal Beli</th>
                  <th className="py-2.5 px-4 text-right">Harga Jual Dapur</th>
                  <th className="py-2.5 px-4 text-right">Margin / Satuan</th>
                  <th className="py-2.5 px-4 text-right">Nilai Aset Modal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const itemValuation = p.currentStock * p.purchasePrice;
                  const unitMargin = p.sellingPrice - p.purchasePrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-4 text-slate-500 text-[11px]">{p.supplierName}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-800">
                        {p.currentStock} {p.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">
                        {formatRupiah(p.purchasePrice)}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-emerald-700">
                        {formatRupiah(p.sellingPrice)}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-emerald-800 font-medium">
                        +{formatRupiah(unitMargin)}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-bold text-slate-900">
                        {formatRupiah(itemValuation)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Sign-off (Printed format) */}
        <div className="hidden print:grid grid-cols-3 gap-6 pt-10 text-center text-xs text-slate-600">
          <div className="space-y-14">
            <p>Ketua Koperasi Pangan MBG</p>
            <p className="border-t border-slate-400 mx-4 pt-1 font-bold text-slate-900">
              ( Drs. H. Suryo Wibowo, M.Si )
            </p>
          </div>
          <div className="space-y-14">
            <p>Bendahara / Manajer Keuangan</p>
            <p className="border-t border-slate-400 mx-4 pt-1 font-bold text-slate-900">
              ( Siti Nurhaliza, SE., Ak )
            </p>
          </div>
          <div className="space-y-14">
            <p>Pengawas / Perwakilan Dapur SPPG</p>
            <p className="border-t border-slate-400 mx-4 pt-1 font-bold text-slate-900">
              ( Dr. Ir. Budi Hartono )
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
