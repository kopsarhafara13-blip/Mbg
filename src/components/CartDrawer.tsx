import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  Calendar, 
  Building, 
  Phone, 
  Users, 
  FileText,
  Truck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalAmount,
    createOrder,
    currentUser,
  } = useApp();

  const [kitchenName, setKitchenName] = useState(
    currentUser?.kitchenName || 'Dapur Sentral SPPG MBG Kec. Cibinong 01'
  );
  const [kitchenContact, setKitchenContact] = useState(
    currentUser?.kitchenContact || '0812-9876-5432 (Ibu Ratna - Ka. Dapur)'
  );
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [targetPortions, setTargetPortions] = useState(1500);
  const [notes, setNotes] = useState('Pengiriman batch pagi jam 05:00 WIB untuk persiapan menu sarapan & makan siang siswa.');

  React.useEffect(() => {
    if (currentUser?.kitchenName) {
      setKitchenName(currentUser.kitchenName);
    }
    if (currentUser?.kitchenContact) {
      setKitchenContact(currentUser.kitchenContact);
    }
  }, [currentUser]);

  if (!cartDrawerOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    createOrder({
      kitchenName,
      kitchenContact,
      deliveryDate,
      targetPortions: Number(targetPortions) || 0,
      notes,
    });
  };

  const presetKitchens = [
    'Dapur Sentral SPPG MBG Kec. Cibinong 01',
    'Dapur MBG Sekolah Mandiri Gizi Sukamaju',
    'Dapur Satuan Pelayanan Gizi (SPPG) Babakan Madang',
    'Dapur Umum Nutrisi MBG Cibinong Barat',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Keranjang Pemesanan Bahan MBG
              </h3>
              <p className="text-xs text-slate-500">
                {cart.length} komoditas bahan pokok dipilih
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Keranjang Masih Kosong</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Silakan pilih bahan pangan pokok dari katalog untuk membuat pesanan pasokan dapur MBG.
            </p>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Kembali ke Katalog Bahan
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Daftar Bahan Pokok Dipesan
                  </h4>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {cart.map(({ product, quantity }) => {
                    const subtotal = product.sellingPrice * quantity;
                    const isExceedingStock = quantity > product.currentStock;

                    return (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 truncate">{product.name}</h5>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Supplier: {product.supplierName}</span>
                            <span>·</span>
                            <span>{formatRupiah(product.sellingPrice)} / {product.unit}</span>
                          </div>
                          {isExceedingStock && (
                            <span className="text-[11px] text-amber-600 font-semibold block">
                              *Melebihi sisa stok gudang ({product.currentStock} {product.unit}). Koperasi akan koordinasi percepatan pasokan.
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-slate-300 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, quantity - 5)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => updateCartQuantity(product.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center text-xs font-bold text-slate-900 tabular-nums focus:outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, quantity + 5)}
                              className="p-1 hover:bg-slate-100 text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right w-24">
                            <span className="font-bold text-slate-900 tabular-nums block">
                              {formatRupiah(subtotal)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {quantity} {product.unit}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Metadata Form (Dapur Sentral MBG info) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Informasi Dapur MBG & Jadwal Pengiriman</span>
                </h4>

                {/* Kitchen Selector */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Nama Dapur MBG Pemesan
                  </label>
                  <select
                    value={kitchenName}
                    onChange={(e) => setKitchenName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    {presetKitchens.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery Date */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tanggal Pengiriman</span>
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Target Portions */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Target Porsi Masak MBG</span>
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={targetPortions}
                      onChange={(e) => setTargetPortions(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold tabular-nums focus:ring-2 focus:ring-emerald-500"
                      placeholder="Contoh: 1500 porsi"
                      required
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kontak Penanggung Jawab Dapur</span>
                  </label>
                  <input
                    type="text"
                    value={kitchenContact}
                    onChange={(e) => setKitchenContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Catatan Khusus (Spesifikasi Gizi / HACCP)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Instruksi sortir potongan, batas temperatur cold chain, dll."
                  />
                </div>
              </div>
            </div>

            {/* Bottom Footer & Action */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Kebutuhan Bahan:</span>
                  <span className="tabular-nums font-semibold">{cart.length} Komoditas</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimasi Pengiriman Logistik:</span>
                  <span className="text-emerald-700 font-semibold">Gratis Armada Koperasi</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">Total Tagihan Dapur MBG:</span>
                  <span className="text-xl font-extrabold text-emerald-700 tabular-nums">
                    {formatRupiah(cartTotalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Kirim Pesanan Bahan Pokok</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
