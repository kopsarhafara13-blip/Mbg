/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LowStockBanner } from './components/LowStockBanner';
import { MarketplaceView } from './components/MarketplaceView';
import { InventoryView } from './components/InventoryView';
import { OrdersView } from './components/OrdersView';
import { FinanceView } from './components/FinanceView';
import { FinancialReportsView } from './components/FinancialReportsView';
import { CartDrawer } from './components/CartDrawer';
import { NotificationModal } from './components/NotificationModal';
import { RestockModal } from './components/RestockModal';
import { InvoiceModal } from './components/InvoiceModal';
import { UpdateStockModal } from './components/UpdateStockModal';
import { EditCooperativeModal } from './components/EditCooperativeModal';
import { EditProductModal } from './components/EditProductModal';
import { LoginView } from './components/LoginView';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, cooperativeProfile } = useApp();

  // Wajib login sebelum mengakses transaksi jual beli
  if (!currentUser) {
    return <LoginView />;
  }

  const isDapur = currentUser.role === 'dapur';
  const isKoperasi = currentUser.role === 'koperasi';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Automatic Stock Low Notification Alert Banner (Internal Koperasi Only) */}
      {isKoperasi && <LowStockBanner />}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'orders' && <OrdersView />}
        {isKoperasi && activeTab === 'inventory' && <InventoryView />}
        {isKoperasi && activeTab === 'finance' && <FinanceView />}
        {isKoperasi && activeTab === 'reports' && <FinancialReportsView />}
        {isDapur && (activeTab === 'inventory' || activeTab === 'finance' || activeTab === 'reports') && (
          <MarketplaceView />
        )}
      </main>

      {/* Shared Modals */}
      <CartDrawer />
      <InvoiceModal />

      {/* Koperasi-Only Internal Modals */}
      {isKoperasi && (
        <>
          <NotificationModal />
          <RestockModal />
          <UpdateStockModal />
          <EditCooperativeModal />
          <EditProductModal />
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              K
            </div>
            <span className="font-semibold text-slate-700">{cooperativeProfile.name}</span>
            <span>·</span>
            <span>{cooperativeProfile.subtitle}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Portal Resmi MBG & SPPG
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              Kemitraan Petani & Peternak Lokal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
