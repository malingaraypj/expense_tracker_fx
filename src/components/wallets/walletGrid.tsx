import React from "react";
import { useWallets } from "../../hooks/useFinanceQueries";
import { formatINR } from "../../utils/formatters";
import { Wallet, CreditCard, Landmark, Coins, TrendingUp } from "lucide-react";
import { type WalletType } from "../../types";

const walletIcons: Record<WalletType, React.ReactNode> = {
  BANK: <Landmark className="w-5 h-5 text-blue-600" />,
  CASH: <Coins className="w-5 h-5 text-emerald-600" />,
  CREDIT_CARD: <CreditCard className="w-5 h-5 text-rose-600" />,
  DIGITAL_WALLET: <Wallet className="w-5 h-5 text-purple-600" />,
  INVESTMENT: <TrendingUp className="w-5 h-5 text-amber-600" />,
};

export const WalletGrid: React.FC = () => {
  const { data: wallets = [], isLoading } = useWallets();

  if (isLoading) {
    return (
      <div className="h-48 rounded-xl bg-slate-100 animate-pulse w-full mb-8" />
    );
  }

  // Calculate Net Worth: Add assets, subtract CREDIT_CARD liabilities
  const netWorth = wallets.reduce((acc, wallet) => {
    return wallet.type === "CREDIT_CARD"
      ? acc - wallet.balance
      : acc + wallet.balance;
  }, 0);

  return (
    <div className="space-y-6 mb-8">
      {/* Net Worth Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
            Total Net Worth
          </p>
          <h1 className="text-4xl font-bold mt-1 font-mono tracking-tight">
            {formatINR(netWorth)}
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">
            {wallets.length} Active Accounts
          </span>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className={`p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow relative ${
              wallet.isDefault
                ? "border-blue-500 ring-1 ring-blue-500/20"
                : "border-slate-200"
            }`}
          >
            {wallet.isDefault && (
              <span className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border border-blue-200">
                Default
              </span>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                {walletIcons[wallet.type] || (
                  <Wallet className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {wallet.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {wallet.type.replace("_", " ")}
                </p>
              </div>
            </div>
            <p
              className={`text-xl font-bold font-mono ${wallet.type === "CREDIT_CARD" ? "text-rose-600" : "text-slate-900"}`}
            >
              {formatINR(wallet.balance)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
