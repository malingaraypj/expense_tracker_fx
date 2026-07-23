import { AnalyticsCharts } from "@/components/analytics/AnalyticsChart";
import { TransactionTable } from "@/components/transactions/transactionTable";
import { WalletGrid } from "@/components/wallets/walletGrid";

function DashboardPage() {
  return (
    <>
      <WalletGrid />
      <AnalyticsCharts />
      <TransactionTable />
    </>
  );
}

export default DashboardPage;
