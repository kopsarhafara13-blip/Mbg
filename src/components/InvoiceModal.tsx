import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate, formatDateTime } from '../utils/formatters';
import { X, Printer, ShieldCheck, CheckCircle2, Truck, Sprout } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { selectedOrderForInvoice, setSelectedOrderForInvoice, cooperativeProfile } = useApp();

  if (!selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 print:hidden">
          <span className="text-xs font-semibold text-slate-600">
            Dokumen Resmi Surat Jalan & Faktur Koperasi MBG
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight uppercase">
                    {cooperativeProfile.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {cooperativeProfile.legalNumber} | {cooperativeProfile.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1">
                {cooperativeProfile.address}<br />
                Call Center Logistik MBG: {cooperativeProfile.phone} | {cooperativeProfile.email}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">
                SURAT JALAN & FAKTUR
              </span>
              <p className="text-xs font-mono font-bold text-slate-900">{order.orderNumber}</p>
              <p className="text-[11px] text-slate-500">
                Tgl Dokumen: {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Delivery & Kitchen Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Tujuan Pengiriman Dapur MBG:
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{order.kitchenName}</p>
              <p className="text-slate-600 mt-0.5">PIC / Penerima: {order.kitchenContact}</p>
              <p className="text-slate-600">Target Menu: <strong>{order.targetPortions.toLocaleString()} Porsi Siswa</strong></p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Jadwal & Logistik:
              </span>
              <p className="text-slate-700">Tanggal Kirim: <strong className="text-slate-900">{formatDate(order.deliveryDate)}</strong></p>
              <p className="text-slate-700">Armada Pengantar: <strong>Truk Pendingin Koperasi (Cold Chain)</strong></p>
              <p className="text-slate-700">Status Pesanan: <strong className="uppercase text-emerald-700">{order.status}</strong></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 font-bold bg-slate-100/70">
                  <th className="py-2 px-3">No</th>
                  <th className="py-2 px-3">Komoditas Bahan Pokok</th>
                  <th className="py-2 px-3">Supplier Asal</th>
                  <th className="py-2 px-3 text-right">Volume</th>
                  <th className="py-2 px-3 text-right">Harga Satuan</th>
                  <th className="py-2 px-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 tabular-nums">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {item.productName}
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">
                      {item.supplierName}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300">
                  <td colSpan={5} className="py-2.5 px-3 text-right font-bold text-slate-700">
                    Total Nilai Pasokan Bahan Pokok:
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-sm text-emerald-800 tabular-nums">
                    {formatRupiah(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
              <span className="font-bold">Instruksi Khusus / Gizi: </span>
              {order.notes}
            </div>
          )}

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
            <div className="space-y-12">
              <p>Petugas Gudang Koperasi</p>
              <div className="border-t border-slate-400 mx-4 pt-1 font-semibold text-slate-800">
                ( Bagian Sortir MBG )
              </div>
            </div>

            <div className="space-y-12">
              <p>Driver / Pengantar Armada</p>
              <div className="border-t border-slate-400 mx-4 pt-1 font-semibold text-slate-800">
                ( Logistik Dingin )
              </div>
            </div>

            <div className="space-y-12">
              <p>Penerima Dapur MBG</p>
              <div className="border-t border-slate-400 mx-4 pt-1 font-semibold text-slate-800">
                ( PJ Dapur Sentral )
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Dicetak otomatis oleh Sistem Marketplace & Operasional Koperasi Pangan MBG.
          </div>
        </div>
      </div>
    </div>
  );
};
