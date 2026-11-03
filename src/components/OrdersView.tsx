import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { formatRupiah, formatDate, formatDateTime } from '../utils/formatters';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Building, 
  Calendar, 
  Users, 
  ChevronRight,
  Filter,
  Check,
  PackageCheck
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, setSelectedOrderForInvoice, setActiveTab, currentUser } = useApp();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const isDapur = currentUser?.role === 'dapur';
  const isKoperasi = currentUser?.role === 'koperasi';

  const userKitchenOrders = isDapur && currentUser?.kitchenName
    ? orders.filter(o => o.kitchenName.toLowerCase().includes(currentUser.kitchenName!.toLowerCase()) || currentUser.kitchenName!.toLowerCase().includes(o.kitchenName.toLowerCase()))
    : orders;

  const filteredOrders = userKitchenOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            <span>Menunggu Konfirmasi</span>
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
            <PackageCheck className="w-3 h-3" />
            <span>Sedang Dipacking / Sortir</span>
          </span>
        );
      case 'dikirim':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
            <Truck className="w-3 h-3" />
            <span>Dalam Pengiriman Armada</span>
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai & Diterima Dapur</span>
          </span>
        );
      case 'batal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pesanan Masuk Dapur MBG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola alokasi pasokan bahan pokok, status pengiriman armada, dan faktur resmi koperasi
          </p>
        </div>

        <button
          onClick={() => setActiveTab('marketplace')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>+ Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Pesanan ({orders.length})
        </button>
        <button
          onClick={() => setStatusFilter('diproses')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === 'diproses'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Diproses ({orders.filter((o) => o.status === 'diproses').length})
        </button>
        <button
          onClick={() => setStatusFilter('dikirim')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === 'dikirim'
              ? 'bg-purple-600 text-white font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Dalam Pengiriman ({orders.filter((o) => o.status === 'dikirim').length})
        </button>
        <button
          onClick={() => setStatusFilter('selesai')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            statusFilter === 'selesai'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Selesai / Terkirim ({orders.filter((o) => o.status === 'selesai').length})
        </button>
      </div>

      {/* Order Cards */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Belum ada pesanan dengan status ini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan katalog bahan pokok untuk membuat pesanan pasokan dapur MBG.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span>·</span>
                      <span className="text-xs text-slate-500">
                        Dibuat: {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{order.kitchenName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
                      title="Lihat Surat Jalan & Faktur"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Surat Jalan & Faktur</span>
                    </button>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Jadwal Kirim: <strong className="text-slate-800">{formatDate(order.deliveryDate)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Target: <strong className="text-slate-800">{order.targetPortions.toLocaleString()} Porsi Masak MBG</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span>PIC: <strong className="text-slate-800">{order.kitchenContact}</strong></span>
                  </div>
                </div>

                {/* Items preview table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="py-1.5 font-medium">Bahan Pokok</th>
                        <th className="py-1.5 font-medium">Supplier Rekanan</th>
                        <th className="py-1.5 font-medium text-right">Volume</th>
                        <th className="py-1.5 font-medium text-right">Harga Satuan</th>
                        <th className="py-1.5 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="text-slate-700">
                          <td className="py-2 font-medium text-slate-900">{item.productName}</td>
                          <td className="py-2 text-slate-500 text-[11px]">{item.supplierName}</td>
                          <td className="py-2 text-right tabular-nums font-semibold">{item.quantity} {item.unit}</td>
                          <td className="py-2 text-right tabular-nums">{formatRupiah(item.unitPrice)}</td>
                          <td className="py-2 text-right tabular-nums font-bold text-slate-900">{formatRupiah(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer / Status Progression */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="text-slate-500">Total Nilai Tagihan: </span>
                    <strong className="text-base text-emerald-800 tabular-nums">
                      {formatRupiah(order.totalAmount)}
                    </strong>
                    {order.status === 'selesai' && (
                      <span className="ml-2 text-[11px] text-emerald-600 font-medium">
                        (Otomatis Tercatat Masuk Kas Koperasi)
                      </span>
                    )}
                  </div>

                  {/* Action buttons based on status */}
                  <div className="flex items-center gap-2">
                    {order.status === 'diproses' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'dikirim')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Kirim Armada Truk Pendingin</span>
                      </button>
                    )}

                    {order.status === 'dikirim' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'selesai')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Konfirmasi Diterima Dapur (Selesaikan)</span>
                      </button>
                    )}

                    {order.status === 'selesai' && (
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Pesanan Selesai & Kas Terbayar</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
