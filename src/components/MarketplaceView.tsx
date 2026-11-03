import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  Search, 
  ShoppingBag, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  Layers,
  ArrowUpDown,
  Plus,
  Minus,
  RefreshCw,
  Building2,
  Calendar
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { products, addToCart, setRestockModalProduct, setActiveTab, setCartDrawerOpen } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  
  // Local quantity inputs for quick ordering
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Bahan' },
    { id: 'karbohidrat', label: 'Beras & Karbohidrat' },
    { id: 'unggas_daging', label: 'Daging & Unggas' },
    { id: 'ikan_seafood', label: 'Ikan & Seafood' },
    { id: 'sayur_buah', label: 'Sayuran Segar' },
    { id: 'telur_susu', label: 'Telur & Olahan Susu' },
    { id: 'bumbu_minyak', label: 'Minyak & Bumbu' },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.supplierLocation && p.supplierLocation.toLowerCase().includes(searchQuery.toLowerCase()));
        
        let matchesStock = true;
        if (stockFilter === 'available') {
          matchesStock = p.currentStock > p.minStockThreshold;
        } else if (stockFilter === 'low') {
          matchesStock = p.currentStock <= p.minStockThreshold;
        }

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'stock') return b.currentStock - a.currentStock;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, stockFilter, sortBy]);

  const handleQuantityChange = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, val),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 10;
    addToCart(product, qty);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_mbg_pangan_1793665871776.jpg"
            alt="Pusat Distribusi Pangan Koperasi MBG"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative max-w-3xl px-6 py-10 sm:px-10 sm:py-14 text-white space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-md backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Pusat Pasokan Resmi Dapur MBG & SPPG</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-wrap balance text-white">
            Marketplace Pemesanan Bahan Pokok Koperasi Dapur MBG
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Sistem pasokan bahan pangan segar, berkualitas, dan terstandarisasi untuk kebutuhan
            menu Makan Bergizi Gratis (MBG). Langsung terhubung dengan kelompok tani, peternak,
            dan nelayan rekanan koperasi.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Petani & Peternak Lokal</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Distribusi Armada Pendingin (Cold Chain)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Transparansi Modal & Margin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Controls: Search, Category Tabs & Filters */}
        <div className="space-y-4">
          {/* Category Tabs (Pilihan Jenis Bahan Pokok) */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pilihan Jenis Bahan Pokok</h2>
              <p className="text-xs text-slate-500">Pilih kategori untuk memfilter komoditas pangan</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              Menampilkan {filteredProducts.length} komoditas
            </span>
          </div>

          {/* Category Button Segmented Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold tabular-nums ${
                      isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Stock filter, and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama bahan, supplier, atau lokasi (contoh: beras, ayam, subang)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {/* Stock status filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Status Stok</option>
                <option value="available">Stok Aman & Tersedia</option>
                <option value="low">Stok Menipis / Kritis</option>
              </select>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">Urut: Nama A-Z</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="stock">Stok: Terbanyak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Tidak ada komoditas bahan pokok ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori bahan pokok Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setStockFilter('all');
              }}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isLowStock = product.currentStock <= product.minStockThreshold;
              const isOutOfStock = product.currentStock <= 0;
              const margin = product.sellingPrice - product.purchasePrice;
              const currentInputQty = quantities[product.id] || 10;
              const subtotalEstimate = product.sellingPrice * currentInputQty;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Resilient fallback container if external domain fails
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('flex', 'items-center', 'justify-center', 'bg-emerald-900/10');
                          }
                        }}
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-semibold bg-white/95 text-slate-800 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                          {product.gradeGizi}
                        </span>

                        {isOutOfStock && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded shadow-xs bg-red-600 text-white">
                            Stok Habis
                          </span>
                        )}
                      </div>

                      {/* Stock Level Overlay at bottom of image */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-2.5 text-white flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-slate-200">Sisa Stok Gudang</span>
                        <span className="font-bold tabular-nums">
                          {product.currentStock} {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-3.5">
                      {/* Name & Description */}
                      <div>
                        <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                          {product.category.replace('_', ' & ')}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing & Supplier Info (Clean Display tanpa harga beli supplier, margin, atau batas aman) */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                        {/* Harga Dapur MBG */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-600 font-medium">Harga Bahan:</span>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                              {formatRupiah(product.sellingPrice)}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">/{product.unit}</span>
                          </div>
                        </div>

                        {/* Supplier Penyedia Resmi */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-start justify-between text-xs text-slate-600">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Supplier Penyedia:
                            </span>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="line-clamp-1">{product.supplierName}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block line-clamp-1">
                              {product.supplierLocation}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Status:
                            </span>
                            <span className={`text-[11px] font-bold ${isOutOfStock ? 'text-red-600' : 'text-emerald-700'}`}>
                              {isOutOfStock ? 'Habis' : 'Tersedia'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Order Action Area */}
                  <div className="p-4 pt-0">
                    {/* Quantity Stepper & Add to Cart */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                        <button
                          onClick={() => handleQuantityChange(product.id, currentInputQty - 5)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Kurangi 5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.currentStock > 0 ? product.currentStock : 999}
                          value={currentInputQty}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center text-xs font-bold bg-transparent text-slate-900 tabular-nums focus:outline-hidden"
                        />
                        <button
                          onClick={() => handleQuantityChange(product.id, currentInputQty + 5)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Tambah 5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : addedItemNotice === product.id
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {addedItemNotice === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ditambahkan!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Pesan ({formatRupiah(subtotalEstimate)})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
