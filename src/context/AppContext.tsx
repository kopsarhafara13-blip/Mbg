import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Order, Transaction, CartItem, StockAlert, OrderStatus, CooperativeProfile, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_TRANSACTIONS } from '../data/mockData';

const DEFAULT_COOP_PROFILE: CooperativeProfile = {
  name: 'Koperasi Pemasaran Haadza Minfadly Rabbi',
  subtitle: 'Pemasok Resmi Bahan Pokok Dapur Program MBG & SPPG',
  legalNumber: 'Badan Hukum No. AHU-0019284.AH.01.26',
  address: 'Sentra Pergudangan & Distribusi Logistik Pangan MBG',
  phone: '0812-8872-9900',
  email: 'kontak@haadzaminfadly.id',
};

interface AppContextType {
  // Authentication & Roles
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  cooperativeProfile: CooperativeProfile;
  updateCooperativeProfile: (profile: CooperativeProfile) => void;
  editingCooperativeModalOpen: boolean;
  setEditingCooperativeModalOpen: (open: boolean) => void;

  products: Product[];
  orders: Order[];
  transactions: Transaction[];
  cart: CartItem[];
  activeTab: 'marketplace' | 'inventory' | 'orders' | 'finance' | 'reports';
  setActiveTab: (tab: 'marketplace' | 'inventory' | 'orders' | 'finance' | 'reports') => void;
  
  // Cart
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartItemCount: number;

  // Checkout / Orders
  createOrder: (orderData: {
    kitchenName: string;
    kitchenContact: string;
    deliveryDate: string;
    targetPortions: number;
    notes: string;
  }) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;

  // Stock & Inventory
  stockAlerts: StockAlert[];
  notificationModalOpen: boolean;
  setNotificationModalOpen: (open: boolean) => void;
  restockModalProduct: Product | null;
  setRestockModalProduct: (product: Product | null) => void;
  editingStockProduct: Product | null;
  setEditingStockProduct: (product: Product | null) => void;
  editingFullProduct: Product | null;
  setEditingFullProduct: (product: Product | null) => void;

  restockProduct: (productId: string, quantity: number, paymentMethod?: 'Transfer Bank Koperasi' | 'Kas Tunai') => void;
  updateStock: (productId: string, newStock: number, newMinThreshold?: number, notes?: string) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;

  // Finance
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  // Utilities
  resetToDefault: () => void;
  notificationDismissed: boolean;
  setNotificationDismissed: (dismissed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Role state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kop_mbg_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null; // Must login first!
  });

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('kop_mbg_user', JSON.stringify(user));
    if (user.role === 'dapur') {
      setActiveTab('marketplace');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kop_mbg_user');
  };

  // Cooperative profile state
  const [cooperativeProfile, setCooperativeProfile] = useState<CooperativeProfile>(() => {
    const saved = localStorage.getItem('kop_mbg_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_COOP_PROFILE;
  });

  const [editingCooperativeModalOpen, setEditingCooperativeModalOpen] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kop_mbg_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kop_mbg_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kop_mbg_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kop_mbg_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'marketplace' | 'inventory' | 'orders' | 'finance' | 'reports'>('marketplace');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [restockModalProduct, setRestockModalProduct] = useState<Product | null>(null);
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [editingFullProduct, setEditingFullProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kop_mbg_profile', JSON.stringify(cooperativeProfile));
  }, [cooperativeProfile]);

  useEffect(() => {
    localStorage.setItem('kop_mbg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kop_mbg_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kop_mbg_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kop_mbg_cart', JSON.stringify(cart));
  }, [cart]);

  const updateCooperativeProfile = (newProfile: CooperativeProfile) => {
    setCooperativeProfile(newProfile);
  };

  // Stock Alerts computation
  const stockAlerts = useMemo<StockAlert[]>(() => {
    return products
      .filter((p) => p.currentStock <= p.minStockThreshold)
      .map((p) => {
        let status: 'habis' | 'kritis' | 'menipis' = 'menipis';
        if (p.currentStock <= 0) status = 'habis';
        else if (p.currentStock <= p.minStockThreshold * 0.5) status = 'kritis';
        return {
          productId: p.id,
          productName: p.name,
          currentStock: p.currentStock,
          minThreshold: p.minStockThreshold,
          unit: p.unit,
          supplierName: p.supplierName,
          purchasePrice: p.purchasePrice,
          status,
        };
      })
      .sort((a, b) => a.currentStock - b.currentStock);
  }, [products]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Create Order from Cart
  const createOrder = (orderData: {
    kitchenName: string;
    kitchenContact: string;
    deliveryDate: string;
    targetPortions: number;
    notes: string;
  }): boolean => {
    if (cart.length === 0) return false;

    const orderNumber = `MBG-PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    let totalCost = 0;

    const orderItems = cart.map((item) => {
      const subtotal = item.product.sellingPrice * item.quantity;
      totalCost += item.product.purchasePrice * item.quantity;
      return {
        productId: item.product.id,
        productName: item.product.name,
        unit: item.product.unit,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        purchasePrice: item.product.purchasePrice,
        subtotal,
        supplierName: item.product.supplierName,
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      kitchenName: orderData.kitchenName,
      kitchenContact: orderData.kitchenContact,
      deliveryDate: orderData.deliveryDate,
      targetPortions: orderData.targetPortions,
      items: orderItems,
      totalAmount: cartTotalAmount,
      totalCost,
      status: 'diproses',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
    };

    // Deduct inventory stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          return {
            ...p,
            currentStock: Math.max(0, p.currentStock - cartMatch.quantity),
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCartDrawerOpen(false);
    setActiveTab('orders');
    return true;
  };

  // Update order status with auto financial booking when finished
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isCompleting = ord.status !== 'selesai' && newStatus === 'selesai';
          
          if (isCompleting) {
            const newTrx: Transaction = {
              id: `trx-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              type: 'pemasukan',
              category: 'Penjualan Dapur MBG',
              amount: ord.totalAmount,
              description: `Penerimaan Pelunasan ${ord.orderNumber} (${ord.kitchenName})`,
              referenceId: ord.id,
              invoiceNo: `INV/KOP-MBG/${ord.orderNumber}`,
              paymentMethod: 'Transfer Bank Koperasi',
            };
            setTransactions((tPrev) => [newTrx, ...tPrev]);
          }

          return {
            ...ord,
            status: newStatus,
            completedAt: newStatus === 'selesai' ? new Date().toISOString() : ord.completedAt,
          };
        }
        return ord;
      })
    );
  };

  // Restock product from supplier: adds stock and logs operational expense
  const restockProduct = (
    productId: string,
    quantity: number,
    paymentMethod: 'Transfer Bank Koperasi' | 'Kas Tunai' = 'Transfer Bank Koperasi'
  ) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct || quantity <= 0) return;

    const totalExpense = targetProduct.purchasePrice * quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, currentStock: p.currentStock + quantity }
          : p
      )
    );

    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengeluaran',
      category: 'Belanja Supplier',
      amount: totalExpense,
      description: `Restock ${targetProduct.name} (+${quantity} ${targetProduct.unit}) via ${targetProduct.supplierName}`,
      referenceId: `restock-${productId}-${Date.now()}`,
      invoiceNo: `PO-SUP/${Date.now().toString().slice(-6)}`,
      paymentMethod,
    };

    setTransactions((prev) => [newTrx, ...prev]);
  };

  // Direct Stock Update (Stock Opname / Penyesuaian Fisik Gudang)
  const updateStock = (
    productId: string,
    newStock: number,
    newMinThreshold?: number,
    notes?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            currentStock: Math.max(0, newStock),
            minStockThreshold: newMinThreshold !== undefined ? Math.max(1, newMinThreshold) : p.minStockThreshold,
          };
        }
        return p;
      })
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addTransaction = (tData: Omit<Transaction, 'id'>) => {
    const newTrx: Transaction = {
      ...tData,
      id: `trx-${Date.now()}`,
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetToDefault = () => {
    setCooperativeProfile(DEFAULT_COOP_PROFILE);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCart([]);
    localStorage.removeItem('kop_mbg_profile');
    localStorage.removeItem('kop_mbg_products');
    localStorage.removeItem('kop_mbg_orders');
    localStorage.removeItem('kop_mbg_transactions');
    localStorage.removeItem('kop_mbg_cart');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        cooperativeProfile,
        updateCooperativeProfile,
        editingCooperativeModalOpen,
        setEditingCooperativeModalOpen,
        products,
        orders,
        transactions,
        cart,
        activeTab,
        setActiveTab,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalAmount,
        cartItemCount,
        createOrder,
        updateOrderStatus,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,
        stockAlerts,
        notificationModalOpen,
        setNotificationModalOpen,
        restockModalProduct,
        setRestockModalProduct,
        editingStockProduct,
        setEditingStockProduct,
        editingFullProduct,
        setEditingFullProduct,
        restockProduct,
        updateStock,
        updateProduct,
        addProduct,
        deleteProduct,
        addTransaction,
        deleteTransaction,
        resetToDefault,
        notificationDismissed,
        setNotificationDismissed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
