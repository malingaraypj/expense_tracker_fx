import React, { useState } from "react";
import {
  useTransactions,
  useTransactionMutations,
} from "../../hooks/useFinanceQueries";
import { formatINR } from "../../utils/formatters";
// import { IconRenderer } from '../../utils/IconRenderer';
import { Edit2, Trash2, ArrowRight, ArrowLeft, PlusCircle } from "lucide-react";
import { type TransactionDTO } from "../../types";
import { TransactionModal } from "./transactionModal";

export const TransactionTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useTransactions(page, 10);
  const { deleteTransaction } = useTransactionMutations();
  const [editingTx, setEditingTx] = useState<TransactionDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-96 rounded-xl bg-slate-100 animate-pulse w-full" />
    );
  }

  const transactions = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.number || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your incomes, expenses, and account transfers
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTx(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-100">
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-6">Category / Flow</th>
              <th className="py-3 px-6">Account</th>
              <th className="py-3 px-6 text-right">Amount</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const isTransfer = tx.type === "TRANSFER";

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-6 text-slate-500 text-xs font-mono">
                      {tx.transactionDate}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-800">
                      {tx.description || "—"}
                    </td>
                    <td className="py-3.5 px-6">
                      {isTransfer ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          Transfer <ArrowRight className="w-3 h-3" />
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: `${tx.categoryColor || "#cbd5e1"}15`,
                            borderColor: `${tx.categoryColor || "#cbd5e1"}40`,
                            color: tx.categoryColor || "#334155",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: tx.categoryColor || "#334155",
                            }}
                          />
                          {tx.categoryName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs">
                      {isTransfer
                        ? `${tx.walletName} ➔ ${tx.destinationWalletName}`
                        : tx.walletName}
                    </td>
                    <td
                      className={`py-3.5 px-6 text-right font-mono font-semibold ${
                        isIncome
                          ? "text-emerald-600"
                          : isTransfer
                            ? "text-blue-600"
                            : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+ " : isTransfer ? "" : "- "}
                      {formatINR(tx.amount)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingTx(tx);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTransaction.mutate(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTransaction={editingTx}
      />
    </div>
  );
};
