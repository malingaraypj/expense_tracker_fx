import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { type DashboardSummaryDTO } from "@/types";

// Import the new split components
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import IncomeChart from "@/components/dashboard/IncomeChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import WalletSummary from "@/components/dashboard/WalletSummary";

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* 1. Top Level Financial Summaries */}
      <SummaryCards
        totalBalance={summary.totalBalance}
        totalMonthlyIncome={summary.totalMonthlyIncome}
        totalMonthlyExpenses={summary.totalMonthlyExpenses}
        netSavings={summary.netSavings}
      />

      {/* 2. Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <ExpenseChart data={summary.expensesByCategory} />
        <IncomeChart data={summary.incomeBySource} />
      </div>

      {/* 3. Recent Transactions & Wallets */}
      <div className="grid gap-4 md:grid-cols-3">
        <RecentTransactions transactions={summary.recentTransactions} />
        <WalletSummary wallets={summary.walletBalances} />
      </div>
    </div>
  );
};

export default DashboardPage;
