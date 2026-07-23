import React, { useState } from "react";
import { useWallets } from "@/hooks/useFinanceQueries";
import { WalletModal } from "@/components/Modals/WalletModal";
import type { WalletDTO } from "@/types";
import { formatINR } from "@/utils/formatters";
import { Plus, Wallet as WalletIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WalletGrid } from "@/components/wallets/walletGrid";

export const WalletPage: React.FC = () => {
  const { data: wallets = [], isLoading, isError } = useWallets();
  //   const { deleteWallet } = useWalletMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletDTO | null>(null);

  const openAddModal = () => {
    setEditingWallet(null);
    setIsModalOpen(true);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  if (isLoading)
    return (
      <div className="p-8 animate-pulse text-slate-500">Loading wallets...</div>
    );
  if (isError)
    return <div className="p-8 text-red-500">Failed to load wallets.</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Wallets</h1>
          <p className="text-slate-500 mt-1">
            Total Net Worth:{" "}
            <span className="font-semibold text-slate-800">
              {formatINR(totalBalance)}
            </span>
          </p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Wallet
        </Button>
      </div>

      {/* Wallets Grid */}
      {wallets.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <WalletIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">
            No wallets found
          </h3>
          <p className="text-slate-500 mb-4">
            Create your first wallet to start tracking your money.
          </p>
          <Button onClick={openAddModal} variant="outline">
            Create Wallet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WalletGrid />
        </div>
      )}

      {/* Modal Wrapper */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingWallet={editingWallet}
      />
    </div>
  );
};
