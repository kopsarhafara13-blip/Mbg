export type ProductCategory = 
  | 'karbohidrat'
  | 'unggas_daging'
  | 'ikan_seafood'
  | 'sayur_buah'
  | 'telur_susu'
  | 'bumbu_minyak';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string; // e.g. 'kg', 'liter', 'ikat', 'tray (30 butir)'
  sellingPrice: number; // Harga jual ke dapur MBG
  purchasePrice: number; // Harga beli modal dari supplier penyedia
  supplierName: string; // Nama supplier penyedia
  supplierContact?: string;
  supplierLocation?: string;
  currentStock: number;
  minStockThreshold: number; // Batas stok minimum (memicu notifikasi otomatis saat <= threshold)
  image: string;
  description: string;
  gradeGizi: string; // Standar gizi MBG, misal: 'Grade A Standar MBG'
  isLocalProduce: boolean; // Hasil petani/peternak lokal binaan
  leadTimeDays: number; // Waktu pengadaan dari supplier
}

export type UserRole = 'koperasi' | 'dapur';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kitchenName?: string;
  kitchenContact?: string;
}

export interface CooperativeProfile {
  name: string;
  subtitle: string;
  legalNumber: string;
  address: string;
  phone: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'menunggu' | 'diproses' | 'dikirim' | 'selesai' | 'batal';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  purchasePrice: number;
  subtotal: number;
  supplierName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  kitchenName: string; // Dapur MBG pemesan
  kitchenContact: string;
  deliveryDate: string; // Tanggal pengiriman jadwal menu MBG
  targetPortions: number; // Jumlah porsi MBG yang akan dimasak
  items: OrderItem[];
  totalAmount: number;
  totalCost: number; // Total HPP modal supplier
  status: OrderStatus;
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  referenceId?: string;
  invoiceNo?: string;
  paymentMethod: 'Transfer Bank Koperasi' | 'Kas Tunai' | 'Termin SPPG';
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  supplierName: string;
  purchasePrice: number;
  status: 'habis' | 'kritis' | 'menipis';
}
