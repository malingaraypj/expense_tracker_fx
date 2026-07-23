import React, { useState } from "react";
import {
  useWallets,
  useCategories,
  useTransactionMutations,
} from "../../hooks/useFinanceQueries";
import {
  type TransactionType,
  type TransactionDTO,
  type TransactionPayload,
} from "../../types";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { formatINR } from "@/utils/formatters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: TransactionDTO | null;
}

// 1. INNER COMPONENT: Only mounts when open. Uses direct state initialization.
const TransactionModalContent: React.FC<Omit<Props, "isOpen">> = ({
  onClose,
  editingTransaction,
}) => {
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();
  const { createTransaction, updateTransaction } = useTransactionMutations();

  const defaultWallet = wallets.find((w) => w.isDefault) || wallets[0];

  // Initialize state directly from props — no useEffect required!
  const [type, setType] = useState<TransactionType>(
    editingTransaction?.type || "EXPENSE",
  );
  const [amount, setAmount] = useState<string>(
    editingTransaction ? editingTransaction.amount.toString() : "",
  );
  const [description, setDescription] = useState<string>(
    editingTransaction?.description || "",
  );
  const [date, setDate] = useState<string>(
    editingTransaction?.transactionDate ||
      new Date().toISOString().split("T")[0],
  );
  const [walletId, setWalletId] = useState<number>(
    editingTransaction?.walletId || 0,
  );
  const [destWalletId, setDestWalletId] = useState<number>(
    editingTransaction?.destinationWalletId || 0,
  );
  const [categoryId, setCategoryId] = useState<number>(
    editingTransaction?.categoryId || 0,
  );

  // Fallback to default wallet if async wallet query finishes after mount
  const effectiveWalletId = walletId || defaultWallet?.id || 0;

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!effectiveWalletId) {
      toast.error("Please select a wallet");
      return;
    }
    if (type === "TRANSFER" && effectiveWalletId === destWalletId) {
      toast.error("Source and destination wallets cannot be the same");
      return;
    }
    if (type !== "TRANSFER" && !categoryId) {
      toast.error("Please select a category");
      return;
    }

    const payload: TransactionPayload = {
      amount: parsedAmount,
      description,
      transactionDate: date,
      type,
      walletId: effectiveWalletId,
      ...(type === "TRANSFER"
        ? { destinationWalletId: destWalletId }
        : { categoryId }),
    };

    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          payload,
        });
      } else {
        await createTransaction.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Handled by mutation error callbacks
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            {(["EXPENSE", "INCOME", "TRANSFER"] as TransactionType[]).map(
              (t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setType(t);
                    setCategoryId(0);
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    type === t
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          {/* Wallet Selection */}
          <div
            className={type === "TRANSFER" ? "grid grid-cols-2 gap-4" : "block"}
          >
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {type === "TRANSFER" ? "From Wallet" : "Account / Wallet"}
              </label>
              <select
                value={effectiveWalletId}
                onChange={(e) => setWalletId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value={0}>Select wallet...</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatINR(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Conditional: To Wallet for TRANSFERS */}
            {type === "TRANSFER" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  To Wallet
                </label>
                <select
                  value={destWalletId}
                  onChange={(e) => setDestWalletId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value={0}>Select destination...</option>
                  {wallets
                    .filter((w) => w.id !== effectiveWalletId)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Conditional: Category for INCOME / EXPENSE */}
          {type !== "TRANSFER" && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value={0}>Select category...</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Grocery shopping, monthly salary..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
            >
              {editingTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. OUTER WRAPPER: Handles mounting/unmounting and passes a dynamic key
export const TransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingTransaction,
}) => {
  if (!isOpen) return null;

  // The secret sauce: when editingTransaction changes, the key changes.
  // This forces React to throw away the old form state and mount a brand new one!
  const modalKey = editingTransaction
    ? `edit-${editingTransaction.id}`
    : "new-tx";

  return (
    <TransactionModalContent
      key={modalKey}
      onClose={onClose}
      editingTransaction={editingTransaction}
    />
  );
};
